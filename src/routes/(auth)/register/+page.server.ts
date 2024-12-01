import { type Actions, fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { verifySessionCookie } from "$lib/server/session";

export const actions: Actions = {
    default: action,
};

async function action(event: RequestEvent) {
    const db = event.platform?.env?.DATABASE;
    const formData = await event.request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const passwordConfirmation = formData.get("passwordConfirmation");

    if (db === undefined) {
        return fail(500, {
            message: "An unknown error has occurred during retrieval of database object.",
            email: email,
            password: password,
            passwordConfirmation: passwordConfirmation,
        });
    }

    if (typeof email !== "string" || typeof password !== "string") {
        return fail(400, {
            message: "Please enter an email and password.",
            email: "",
            password: "",
            passwordConfirmation: "",
        });
    }

    if (password != passwordConfirmation) {
        return fail(400, {
            message: "Passwords do not match! Please re-confirm the entered password.",
            email: email,
            password: password,
            passwordConfirmation: "",
        });
    }

    const exists = (await db
        .prepare(`
            SELECT *
            FROM users
            WHERE email = ?
        `)
        .bind(email)
        .first()) != null;

    if (exists) {
        return fail(400, {
            message: "An active user is already registered under the provided email address.",
            email: "",
            password: password,
            passwordConfirmation: "",
        });
    }

    const registerResponse = await event.fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
    });

    if (!registerResponse.ok) {
        return fail(500, {
            message: `An unknown error has occurred during submission: ${registerResponse.statusText}`,
            email: email,
            password: password,
            passwordConfirmation: "",
        });
    }

    const loginResponse = await event.fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
    });

    return loginResponse.ok
        ? redirect(303, "/")
        : fail(500, {
            message: `An unknown error has occurred during login: ${loginResponse.status}\n${await loginResponse.text()}`,
            email: email,
            password: password,
            passwordConfirmation: "",
        });
}

/** @type {import('./$types').PageLoad} */
export async function load({ cookies, platform }) {
    if (platform === undefined || platform.env === undefined)
        return new Response(null, { status: 500 });

    const db = platform.env.DATABASE;

    return await verifySessionCookie(cookies, db)
        ? redirect(302, "/")
        : {}
}