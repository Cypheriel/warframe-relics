/** @type {import(".$types/routes").PageLoad} */
export async function load({ fetch }) {
    const response = await fetch("/api/v1/auth/profile");
    if (!response.ok) {
        return {
            user: {
                uuid: null,
                email: null,
                username: null,
            },
        };
    }

    const user = await response.json();

    return {
        user: {
            uuid: user["uuid"],
            email: user["email"],
            username: user["username"],
        },
    };
}