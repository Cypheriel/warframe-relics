/** @type {import("./$types").RequestHandler} */
export async function GET({ fetch }) {
    return await fetch("/api/v1/auth/logout", { method: "POST" });
}