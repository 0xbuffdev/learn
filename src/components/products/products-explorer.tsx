import { cn } from "~/lib/utils";
import { useState } from "react";
import {
	FRAME_EDGE,
	PAGE_COLUMN,
	PageHero,
	SectionFrame,
} from "~/components/frame";
import { DivisionGrid } from "~/components/products/division-grid";
import {
	FilterBar,
	filterProducts,
	type FilterId,
	useFilterCounts,
} from "~/components/products/product-filter";
import { products } from "~/lib/products";
import { SITE } from "~/lib/site";

/**
 * The docs index catalogue — the 0xBUFF products explorer, carried over:
 * PageHero (eyebrow, decoding title, description) with the filter bar inside
 * it, then every matching product grouped by division in one ruled frame
 * that spans rail to rail.
 *
 * Filter state is client state rather than URL search params: the result set
 * is a view over one page's worth of data and nothing about it is worth a
 * shareable link or a history entry.
 */
export function ProductsExplorer() {
	const [filter, setFilter] = useState<FilterId>("all");
	const [query, setQuery] = useState("");

	const counts = useFilterCounts(products);
	const groups = filterProducts(products, filter, query);
	const total = groups.reduce((sum, group) => sum + group.items.length, 0);

	return (
		<>
			<PageHero
				description={SITE.description}
				eyebrow={
					<>
						ps --tree <span className="text-primary">{"//"}</span>{" "}
						{products.length} child processes
					</>
				}
				title={SITE.title}
			>
				<FilterBar
					counts={counts}
					onChange={setFilter}
					onQuery={setQuery}
					query={query}
					value={filter}
				/>
			</PageHero>

			{/*
			 * `aria-live` on the results region, not the page: the count is the
			 * only thing that changed silently, and a sighted keyboard user
			 * filtering by tab gets the same confirmation a screen reader does.
			 */}
			<div aria-live="polite" className={cn("mx-auto w-full", PAGE_COLUMN)}>
				{/* `border-t-0`: PageHero's band rule is this frame's top edge. */}
				<SectionFrame className="grid border-t-0 sm:grid-cols-2 lg:grid-cols-3">
					{total === 0 && <NoMatches query={query} />}
					{groups.map((group) => (
						<DivisionGrid group={group} key={group.division} />
					))}
				</SectionFrame>
			</div>
		</>
	);
}

/** The empty state for a search that matched nothing. */
function NoMatches({ query }: { query: string }) {
	return (
		<p
			className={cn(
				FRAME_EDGE,
				"col-span-full py-24 text-center font-mono text-muted-foreground text-sm",
			)}
		>
			<span className="text-accent">grep:</span> no process matches{" "}
			{`"${query.trim()}"`}
		</p>
	);
}
