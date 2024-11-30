import { sha1 } from "@oslojs/crypto/sha1";
import { encodeHexLowerCase } from "@oslojs/encoding";

const re = /<p>[\s\b]*([0-9a-f]{40})/;

/** @type {import("./$types").RequestHandler} */
export async function GET({ fetch, params }) {
    const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(params.id)));
    const response = await fetch(`https://forums.warframe.com/profile/${params.id}-undefined/?tab=field_core_pfield_1`)
    const body = await response.text()
    const content = (re.exec(body) ?? [])[1];

    console.log(body)
    console.log(`hash=${hash}`);
    console.log(`content=${content}`);

    return hash == content
        ? new Response(
            null,
            {
                status: 204,
            })
        : new Response(
            null,
            {
                status: 400,
            });
}