import MurmurHash3 from "imurmurhash";
import { verifySessionCookie } from "$lib/server/session";


/** @type {import("./$types").RequestHandler} */
export async function PUT({ fetch, params, platform, cookies }) {
    if (platform === undefined || platform.env === undefined)
        return new Response(null, { status: 500 });

    const db = platform.env.DATABASE;
    const hash = MurmurHash3(params.username).result();
    const response = (await (await fetch(`https://content.warframe.com/dynamic/getProfileViewingData.php?n=${params.username}`)).json())["Results"][0];
    const username = response["DisplayName"];
    const value = Number(response["LoadOutPreset"]["n"]);
    const success = hash == value;

    if (success) {
        const session = await verifySessionCookie(cookies, db);
        if (session == null) {
            return new Response(null, { status: 401 })
        }

        await db.prepare(`
            UPDATE users
            SET username = ?
            WHERE uuid = ?
        `)
            .bind(username, session?.userUuid)
            .run();
    }
    return success
        ? new Response(
            null,
            {
                status: 204,
            })
        : new Response(
            `Expected ${hash}, found ${value}`,
            {
                status: 400,
            });
}