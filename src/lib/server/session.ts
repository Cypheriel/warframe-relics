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

    const sessionRecord = await db.prepare(`
        SELECT *
        FROM sessions
        WHERE id = ?;
    `)
        .bind(encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken))))
        .first();

    if (sessionRecord == null) {
        return null;
    }

    return {
        id: sessionRecord["id"] as string,
        userUuid: sessionRecord["user_uuid"] as string,
        expiresOn: sessionRecord["expires_on"] as Date
    }
}