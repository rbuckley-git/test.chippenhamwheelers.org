import { MediaRepository } from "emdash";

type ContentRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ContentRecord {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function filenameFromUrl(url: string) {
	const pathname = url.split(/[?#]/, 1)[0] ?? url;
	return decodeURIComponent(pathname.split("/").pop() ?? "");
}

async function resolveNode(value: unknown, media: MediaRepository): Promise<unknown> {
	if (Array.isArray(value)) return Promise.all(value.map((item) => resolveNode(item, media)));
	if (!isRecord(value)) return value;

	if (value._type === "image" && isRecord(value.asset) && typeof value.asset.url === "string") {
		const imported = await media.findByFilename(filenameFromUrl(value.asset.url));
		if (imported) {
			return { ...value, asset: { ...value.asset, _ref: imported.id, url: imported.storageKey } };
		}
	}

	const entries = await Promise.all(
		Object.entries(value).map(async ([key, item]) => [key, await resolveNode(item, media)] as const),
	);
	return Object.fromEntries(entries);
}

export async function resolveImportedMedia(content: unknown, media: MediaRepository | null) {
	return media ? resolveNode(content, media) : content;
}
