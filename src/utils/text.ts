const namedEntities: Record<string, string> = {
	amp: "&",
	apos: "'",
	quot: '"',
	lt: "<",
	gt: ">",
	nbsp: "\u00a0",
	ndash: "–",
	mdash: "—",
	hellip: "…",
	rsquo: "’",
	lsquo: "‘",
	rdquo: "”",
	ldquo: "“",
};

export function decodeHtmlEntities(value: string | null | undefined): string | null | undefined {
	if (value == null) return value;
	return value
		.replace(/&#x([0-9a-f]+);/gi, (_, hexadecimal: string) =>
			String.fromCodePoint(Number.parseInt(hexadecimal, 16)),
		)
		.replace(/&#(\d+);/g, (_, decimal: string) =>
			String.fromCodePoint(Number.parseInt(decimal, 10)),
		)
		.replace(/&([a-z]+);/gi, (entity, name: string) => namedEntities[name.toLowerCase()] ?? entity);
}
