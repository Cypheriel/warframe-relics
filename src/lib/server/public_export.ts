import { decompress } from "lzma-js-simple";

export let publicExportIndex: { [_: string]: unknown };
export const publicExportData: { [_: string]: [{[_: string]: unknown}] } = {
    "ExportRelicArcane": null,
};
let language: string;
export let lastFetched = (new Date(0)).getTime();

export async function fetchIndex(language_code: string = "en") {
    const response = await fetch(`https://origin.warframe.com/PublicExport/index_${language_code}.txt.lzma`);
    const buf = new Uint8Array(await response.arrayBuffer());

    // For now, all that we care about are relics. Someday, more information may be helpful.
    const index_data = decompress(buf).toString();

    if (index_data == null) {
        console.log("Index data missing.");
        return;
    }

    language = language_code;
    publicExportIndex = {
        "ExportRelicArcane": `ExportRelicArcane_en.json!${index_data.split("ExportRelicArcane_en.json!")[1].split("\n", 1)[0]}`,
    };
    lastFetched = Date.now();
}

export async function getData(location: string): Promise<unknown> {
    if (publicExportIndex[location] == null)
        return null;

    const response = await fetch(`https://content.warframe.com/PublicExport/Manifest/${publicExportIndex[location]}`);

    // For some reason, DE doesn't properly escape their `\r`s and `\n`s, so we do it for them.
    const json = JSON.parse((await response.text()).replaceAll("\r", "\\r").replaceAll("\n", "\\n"))[location];
    publicExportData[location] = json;
    return Response.json(json);
}