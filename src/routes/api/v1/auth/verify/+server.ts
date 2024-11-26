import { verifySessionCookie } from "$lib/server/session";

/** @type {import("./$types").RequestHandler} */
export async function GET({ cookies, platform }) {
    if (platform === undefined || platform.env === undefined)
        return new Response(null, { status: 500 });

    const db = platform.env.DATABASE;

    return await verifySessionCookie(cookies, db) != null
        ? new Response(null, { status: 204 })
        : new Response(null, { status: 401 })
}