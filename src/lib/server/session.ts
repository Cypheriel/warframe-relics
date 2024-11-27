import type { Cookies } from "@sveltejs/kit";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { D1Database } from "@cloudflare/workers-types";

export interface Session {
    id: string;
    userUuid: string;
    expiresOn: Date;
}

export function setSessionTokenCookie(cookies: Cookies, token: string, expiresAt: Date): void {
    cookies.set("session", token, {
        httpOnly: true,
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
    });
}

export function deleteSessionTokenCookie(cookies: Cookies): void {
    cookies.set("session", "", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });
}

export async function verifySessionCookie(cookies: Cookies, db: D1Database): Promise<Session | null> {
    const sessionToken = cookies.get("session");
    if (sessionToken === undefined || db === undefined) {
        return null;
    }

    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)))

    const sessionRecord = await db.prepare(`
        SELECT *
        FROM sessions
        WHERE id = ?;
    `)
        .bind(sessionId)
        .first();

    if (sessionRecord == null) {
        return null;
    }

    let expiration = Date.parse(<string>sessionRecord["expires_on"]);

    // Check if session has expired.
    if (Date.now() > expiration) {
        deleteSessionTokenCookie(cookies);
        return null;
    }

    if (Date.now() > expiration - 1000 * 60 * 60 * 24 * 14) {
        expiration = Date.now() + 1000 * 60 * 60 * 24 * 30;
        setSessionTokenCookie(cookies, sessionToken, new Date(expiration));
        await db
            .prepare(`
                UPDATE sessions
                SET expires_on = ?
                WHERE id = ?;
            `)
            .bind(new Date(expiration), sessionId)
            .run();
    }

    return {
        id: sessionRecord["id"] as string,
        userUuid: sessionRecord["user_uuid"] as string,
        expiresOn: new Date(expiration),
    };
}