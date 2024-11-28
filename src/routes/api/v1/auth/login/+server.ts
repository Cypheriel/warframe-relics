import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { v4 as uuidv4 } from "uuid";
import { setSessionTokenCookie } from "$lib/server/session";

/** @type {import("./$types").RequestHandler} */
export async function POST({ request, cookies, platform }) {
    if (platform === undefined || platform.env === undefined)
        return new Response(null, { status: 500 });

    const db = platform.env.DATABASE;

    const { email, password } = await request.json();

    const user = (await db.prepare(`
        SELECT *
        FROM users
        WHERE email = ?;
    `)
        .bind(email)
        .first());

    if (user == null) {
        return new Response("No user is registered under the specified email.", { status: 400 });
    }

    const verified = (await fetch(`https://argon2.cypheriel.dev/verify?value=${password}&hash=${encodeURIComponent(user["password_hash"])}`)).status == 200;

    if (verified) {
        // Create session
        const sessionToken = uuidv4();
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
        const sessionExpiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

        const { success } = await db.prepare(`
            INSERT INTO sessions (id, user_uuid, expires_on)
            VALUES (?, ?, ?);
        `)
            .bind(sessionId, user["uuid"], sessionExpiration.toISOString())
            .run();

        setSessionTokenCookie(cookies, sessionToken, sessionExpiration);

        return success
            ? new Response(JSON.stringify({ token: sessionToken }), { status: 200 })
            : new Response("An unknown error has occurred. Case #1", { status: 500 });
    }

    return new Response("Incorrect password.", { status: 401 });
}