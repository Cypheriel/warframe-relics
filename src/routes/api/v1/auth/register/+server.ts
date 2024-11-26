import { v5 as uuidv5 } from 'uuid';
import { hash } from "@node-rs/argon2";

const USER_NAMESPACE = 'd38d411b-aa01-48c7-8980-aa2e7154a29f'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, platform }) {
	if (platform === undefined || platform.env === undefined)
		return new Response(null, { status: 500 })

	const db = platform.env.DATABASE

	const { email, password } = await request.json()

	const existing = (await db.prepare(`
        SELECT *
        FROM users
        WHERE email = ?;
	`)
		.bind(email)
		.run())
		.results

	if (existing.length != 0)
		return new Response("A user has already been registered under this email.", { status: 409 })

	const passwordHash = await hash(password)

	const result = await db.prepare(`
        INSERT INTO users (uuid, email, password_hash)
        VALUES (?, ?, ?);
	`)
		.bind(uuidv5(email, USER_NAMESPACE), email, passwordHash)
		.run()

	return new Response("User successfully created.", { status: result.success ? 200 : 500 })
}