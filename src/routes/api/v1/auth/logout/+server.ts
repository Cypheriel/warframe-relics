import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { deleteSessionTokenCookie } from "$lib/server/session";
import { redirect } from "@sveltejs/kit";

/** @type {import("./$types").RequestHandler} */
export async function POST({ cookies, platform }) {
    if (platform === undefined || platform.env === undefined)
        return new Response(null, { status: 500 });

    const db = platform.env.DATABASE;
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(cookies.get("session"))));
    deleteSessionTokenCookie(cookies);
    await db
        .prepare(`
            DELETE
            FROM sessions
            WHERE id = ?;
        `)
        .bind(sessionId)
        .run();

    return redirect(303, "/login");
}