import { verifySessionCookie } from "$lib/server/session";

/** @type {import("./$types").RequestHandler} */
export async function GET({ cookies, platform }) {
    if (platform === undefined || platform.env === undefined)
        return new Response(null, { status: 500 });

    const db = platform.env.DATABASE;

    const session = await verifySessionCookie(cookies, db);

    if (session == null) {
        return new Response(null, { status: 401 });
    }

    const userRecord = await db
        .prepare(`
            SELECT *
            FROM users
            WHERE uuid = ?
        `)
        .bind(session.userUuid)
        .first();

    return userRecord != null
        ? new Response(JSON.stringify(userRecord), { status: 200 })
        : new Response(null, { status: 500 });
}