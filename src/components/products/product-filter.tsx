import { Search } from "lucide-react";
import { useMemo } from "react";
import { cn } from "~/lib/utils";
import { type Product } from "~/lib/products";

/**
 * The product filter — division and free text.
 *
 * Every filter is a *predicate over the product record*, not a list of ids.
 * That is what makes the counts next to each tab derivable (`products.filter`
 * with the same predicate) rather than hand-maintained, so a tab can never
 * disagree with what clicking it shows.
 */

const FILTERS = [
	{ id: "all", label: "All products", test: () => true },
	{
		id: "tools",
		label: "Tools",
		test: (p: Product) => p.division === "tools",
	},
	{
		id: "education",
		label: "Education",
		test: (p: Product) => p.division === "education",
	},
] as const;

export type FilterId = (typeof FILTERS)[number]["id"];

/** Products matching `filter` and `query`, grouped by division, empties dropped. */
export function filterProducts(
	all: Product[],
	filter: FilterId,
	query: string,
): { division: Product["division"]; items: Product[] }[] {
	const test = FILTERS.find((f) => f.id === filter)?.test ?? (() => true);
	const q = query.trim().toLowerCase();

	const visible = all.filter(
		(p) =>
			test(p) &&
			(!q ||
				[p.name, p.kind, p.tagline].some((field) =>
					field.toLowerCase().includes(q),
				)),
	);

	return (["tools", "education"] as const)
		.map((division) => ({
			division,
			items: visible.filter((p) => p.division === division),
		}))
		.filter((group) => group.items.length > 0);
}

export function FilterBar({
	value,
	onChange,
	query,
	onQuery,
	counts,
}: {
	value: FilterId;
	onChange: (id: FilterId) => void;
	query: string;
	onQuery: (query: string) => void;
	/** Count per filter id, computed once by the page from the same predicates. */
	counts: Record<FilterId, number>;
}) {
	return (
		<div className="flex flex-col items-center gap-4">
			<div
				aria-label="Filter products"
				className="inline-flex max-w-full overflow-x-auto rounded-sm border border-border bg-card/60 p-1 backdrop-blur"
				role="tablist"
			>
				{FILTERS.map((f) => {
					const selected = value === f.id;
					return (
						<button
							aria-selected={selected}
							className={cn(
								"flex shrink-0 items-center gap-2 rounded-[3px] px-3.5 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
								{
									"bg-primary text-primary-foreground": selected,
									"text-muted-foreground hover:bg-muted hover:text-foreground":
										!selected,
								},
							)}
							key={f.id}
							onClick={() => onChange(f.id)}
							role="tab"
							type="button"
						>
							{f.label}
							<span
								className={cn("tabular-nums", {
									"text-primary-foreground/60": selected,
									"text-muted-foreground/50": !selected,
								})}
							>
								{counts[f.id].toString().padStart(2, "0")}
							</span>
						</button>
					);
				})}
			</div>

			<label className="flex w-full max-w-sm items-center gap-2.5 rounded-sm border border-border bg-background/60 px-3 py-2 font-mono text-xs transition-colors focus-within:border-primary">
				<Search aria-hidden="true" className="size-3.5 text-muted-foreground" />
				<span aria-hidden="true" className="text-primary">
					grep
				</span>
				<span className="sr-only">Search products</span>
				<input
					className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/50"
					onChange={(e) => onQuery(e.target.value)}
					placeholder="name, kind or description…"
					type="search"
					value={query}
				/>
			</label>
		</div>
	);
}

/**
 * Product counts for every filter tab.
 *
 * Lives here, next to the predicates it counts, so a new filter cannot ship
 * without a count — the page never has to know how the numbers are derived.
 */
export function useFilterCounts(all: Product[]): Record<FilterId, number> {
	return useMemo(() => {
		const counts = {} as Record<FilterId, number>;
		for (const filter of FILTERS) {
			counts[filter.id] = all.filter(filter.test).length;
		}
		return counts;
	}, [all]);
}
