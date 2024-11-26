/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const response = await fetch("/api/v1/auth/profile")
    const user = await response.json()

    return {
        user: {
            uuid: user["uuid"],
            email: user["email"],
        }
    };
}