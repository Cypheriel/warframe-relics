import { redirect, type RequestEvent } from "@sveltejs/kit";
import { verifySessionCookie } from "$lib/server/session";

export async function load(event: RequestEvent) {
    const authenticated = await verifySessionCookie(event.cookies, event.platform?.env?.DATABASE);

    if (authenticated == null) {
        return redirect(302, "/login")
    }
}