type PortableTextSpan = {
	_type?: string;
	_key?: string;
	text?: string;
	marks?: string[];
};

type PortableTextBlock = {
	_type?: string;
	_key?: string;
	style?: string;
	children?: PortableTextSpan[];
	markDefs?: unknown[];
	[key: string]: unknown;
};

type TableCell = {
	_type: "tableCell";
	_key: string;
	content: PortableTextSpan[];
	isHeader?: boolean;
	markDefs?: unknown[];
};

type TableRow = {
	_type: "tableRow";
	_key: string;
	cells: TableCell[];
};

type PortableTextTable = {
	_type: "table";
	_key: string;
	rows: TableRow[];
	hasHeaderRow: true;
	markDefs?: unknown[];
};

type TablePressExport = {
	id: string;
	data: string[][];
};

type PortableTextHtmlBlock = {
	_type?: string;
	html?: string;
	[key: string]: unknown;
};

const tablePressModules = import.meta.glob("../data/tablepress/*.json", {
	eager: true,
	import: "default",
}) as Record<string, TablePressExport>;
const tablePressTables = new Map(
	Object.values(tablePressModules).map((table) => [table.id, table.data]),
);

function isTableSeparator(span: PortableTextSpan): boolean {
	return typeof span.text === "string" && /^\t\s*$/.test(span.text);
}

function tableRows(block: PortableTextBlock): PortableTextSpan[][] | null {
	const spans = block.children ?? [];
	if (spans.length < 4 || !isTableSeparator(spans[0])) return null;

	const rows: PortableTextSpan[][] = [];
	let row: PortableTextSpan[] = [];
	for (const span of spans.slice(1)) {
		if (isTableSeparator(span)) {
			if (row.length > 0) rows.push(row);
			row = [];
		} else {
			row.push(span);
		}
	}
	if (row.length > 0) rows.push(row);

	return rows.length >= 2 && rows[0].length >= 2 ? rows : null;
}

function hasTableSeparator(block: PortableTextBlock): boolean {
	return (block.children ?? []).some(isTableSeparator);
}

function isAudaxResultsHeader(row: PortableTextSpan[]): boolean {
	return row[0]?.text?.trim().toLowerCase() === "firstname" &&
		row[1]?.text?.trim().toLowerCase() === "lastname" &&
		row.at(-2)?.text?.trim().toLowerCase() === "total distance" &&
		row.at(-1)?.text?.trim().toLowerCase() === "medal";
}

function compactAudaxHeader(row: PortableTextSpan[]): PortableTextSpan[] {
	const totalDistanceIndex = row.findIndex((span) => span.text?.trim().toLowerCase() === "total distance");
	if (totalDistanceIndex < 4) return row;
	if (row.slice(2, totalDistanceIndex).some((span) => /\r?\n/.test(span.text ?? ""))) return row;

	const compacted = [...row.slice(0, 2)];
	for (let index = 2; index < totalDistanceIndex; index += 2) {
		const distance = row[index];
		const event = row[index + 1];
		compacted.push({
			...distance,
			text: [distance?.text, event?.text].filter(Boolean).join("\n"),
		});
	}
	return [...compacted, ...row.slice(totalDistanceIndex)];
}

function normaliseRows(rows: PortableTextSpan[][]): PortableTextSpan[][] {
	const header = rows[0] && isAudaxResultsHeader(rows[0]) ? compactAudaxHeader(rows[0]) : rows[0];
	const normalisedRows = header ? [header, ...rows.slice(1)] : rows;
	const columnCount = header?.length ?? 0;
	if (!columnCount) return rows;

	return normalisedRows.map((row, rowIndex) => {
		if (rowIndex === 0 || row.length >= columnCount) return row;

		if (isAudaxResultsHeader(rows[0])) {
			const eventColumnCount = columnCount - 4;
			const lastValue = row.at(-1);
			const hasMedal = /^(gold|silver|bronze)$/i.test(lastValue?.text?.trim() ?? "");
			const attendance = row.slice(2, hasMedal ? -2 : -1);
			const totalDistance = (hasMedal ? row.at(-2) : lastValue) ?? { _type: "span", text: "" };
			const medal = (hasMedal ? lastValue : undefined) ?? { _type: "span", text: "" };
			return [
				...row.slice(0, 2),
				...attendance,
				...Array.from({ length: Math.max(0, eventColumnCount - attendance.length) }, () => ({
					_type: "span",
					text: "",
				})),
				totalDistance,
				medal,
			];
		}

		return [
			...row,
			...Array.from({ length: columnCount - row.length }, () => ({ _type: "span", text: "" })),
		];
	});
}

function toTable(block: PortableTextBlock, rows: PortableTextSpan[][]): PortableTextTable {
	return {
		_type: "table",
		_key: block._key ?? "migrated-table",
		hasHeaderRow: true,
		markDefs: block.markDefs,
		rows: normaliseRows(rows).map((cells, rowIndex) => ({
			_type: "tableRow",
			_key: `${block._key ?? "table"}-row-${rowIndex}`,
			cells: cells.map((span, columnIndex) => ({
				_type: "tableCell",
				_key: `${block._key ?? "table"}-cell-${rowIndex}-${columnIndex}`,
				content: [span],
				isHeader: rowIndex === 0,
				markDefs: block.markDefs,
			})),
		})),
	};
}

function shortcodeTable(block: PortableTextHtmlBlock): PortableTextTable | null {
	const html = block.html?.trim() ?? "";
	const match = html.match(/^\[table\s+id=["']?(\d+)["']?\s*\/?\]$/i);
	const id = match?.[1];
	const rows = id ? tablePressTables.get(id) : null;
	if (!rows || rows.length < 2 || rows[0].length < 2) return null;

	return toTable(
		{ _type: "block", _key: `tablepress-${id}`, markDefs: [] },
		rows.map((row, rowIndex) =>
			row.map((text, columnIndex) => ({
				_type: "span",
				_key: `tablepress-${id}-${rowIndex}-${columnIndex}`,
				text,
			})),
		),
	);
}

export function transformMigratedTables(content: unknown): unknown {
	if (!Array.isArray(content)) return content;

	const transformed: unknown[] = [];
	for (let index = 0; index < content.length; index++) {
		const value = content[index];
		if (!value || typeof value !== "object") {
			transformed.push(value);
			continue;
		}

		const block = value as PortableTextBlock;
		if (block._type === "htmlBlock") {
			const table = shortcodeTable(block as PortableTextHtmlBlock);
			transformed.push(table ?? value);
			continue;
		}
		if (block._type !== "block" || !isTableSeparator(block.children?.[0] ?? {})) {
			transformed.push(value);
			continue;
		}

		const tableBlocks = [block];
		let nextIndex = index + 1;
		while (nextIndex < content.length) {
			const nextValue = content[nextIndex];
			if (!nextValue || typeof nextValue !== "object") break;
			const nextBlock = nextValue as PortableTextBlock;
			if (nextBlock._type !== "block") break;

			const combined = {
				...block,
				children: tableBlocks.flatMap((tableBlock) => tableBlock.children ?? []),
			};
			const currentRows = tableRows(combined);
			if (currentRows && !isTableSeparator(combined.children?.at(-1) ?? {}) && !hasTableSeparator(nextBlock)) {
				break;
			}

			tableBlocks.push(nextBlock);
			nextIndex++;
			const updated = tableBlocks.flatMap((tableBlock) => tableBlock.children ?? []);
			const updatedBlock = { ...block, children: updated };
			if (tableRows(updatedBlock) && isTableSeparator(updated.at(-1) ?? {})) break;
		}

		const mergedBlock = {
			...block,
			children: tableBlocks.flatMap((tableBlock) => tableBlock.children ?? []),
			markDefs: tableBlocks.flatMap((tableBlock) => tableBlock.markDefs ?? []),
		};
		const rows = tableRows(mergedBlock);
		transformed.push(rows ? toTable(mergedBlock, rows) : value);
		index += tableBlocks.length - 1;
	}

	return transformed;
}
