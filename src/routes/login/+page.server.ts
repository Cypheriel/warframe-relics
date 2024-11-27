import { type Actions, fail, redirect, type RequestEvent } from "@sveltejs/kit";

export const actions: Actions = {
    default: action,
};

async function action(event: RequestEvent) {
    const db = event.platform?.env?.DATABASE;
    const formData = await event.request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (db === undefined) {
        return fail(500, {
            message: "An unknown error has occurred during retrieval of database object.",
            email: email,
            password: password,
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

    const exists = (await db
        .prepare(`
            SELECT *
            FROM users
            WHERE email = ?
        `)
        .bind(email)
        .first()) != null;

    if (!exists) {
        return fail(400, {
            message: "There is not an active user registered under the provided email address.",
            email: "",
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
            message: `An unknown error has occurred: ${loginResponse.status}\n${await loginResponse.text()}`,
            email: email,
            password: password,
            passwordConfirmation: "",
        });
}