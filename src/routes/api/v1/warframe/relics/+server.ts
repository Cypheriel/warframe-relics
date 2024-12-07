import { fetchIndex, getData, lastFetched, publicExportData, publicExportIndex } from "$lib/server/public_export";

/** @type {import("./$types").RequestHandler} */
export async function GET({ platform }) {
    if (platform === undefined || platform.env === undefined)
        return new Response(null, { status: 500 });

    const db = platform.env.DATABASE;

    // Re-fetch every 300 seconds (5 minutes)
    if ((Date.now() / 1_000) - (lastFetched / 1_000) > 300 || publicExportIndex == null) {
        const lastIndex = publicExportIndex;
        await fetchIndex();
        if (lastIndex != publicExportIndex) {
            await getData("ExportRelicArcane");
        }
    }

    return new Response(JSON.stringify(publicExportData["ExportRelicArcane"]));
}