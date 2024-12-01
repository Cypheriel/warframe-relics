import { verifySessionCookie } from "$lib/server/session";
import { redirect } from "@sveltejs/kit";

/** @type {import(".$types/routes").PageLoad} */
export async function load({ cookies, platform }) {
    const db = platform?.env?.DATABASE;
    const session = await verifySessionCookie(cookies, db);

    if (session == null) {
        return redirect(302, "/login");
    }

    const user = await db
        .prepare(`
            SELECT *
            FROM users
            WHERE uuid = ?;
        `)
        .bind(session.userUuid)
        .first();

    if (user.username == null) {
        return redirect(302, "/username-verification");
    }
}