import { cn } from "~/lib/utils";
import { SectionLabel } from "~/components/frame";
import { DocsCallout, ProductCard } from "~/components/products/product-card";
import type { Product } from "~/lib/products";

/**
 * One division's products, with a docs callout in any unused slots at the end
 * of the grid. Rows size themselves from their content; product and callout
 * cells stretch to fill the row without imposing a minimum height.
 *
 * The grid has one column below `sm`, two from `sm` to `lg`, and three from
 * `lg` onward. Only render the callout when a row is incomplete at that
 * breakpoint, and span exactly the remaining columns.
 */
export function DivisionGrid({
	group,
}: {
	group: { division: Product["division"]; items: Product[] };
}) {
	const mediumEmptySlots = (2 - (group.items.length % 2)) % 2;
	const largeEmptySlots = (3 - (group.items.length % 3)) % 3;

	return (
		<section
			aria-labelledby={`division-${group.division}`}
			className="col-span-full grid grid-cols-subgrid"
		>
			<SectionLabel
				id={`division-${group.division}`}
				meta={group.items.length.toString().padStart(2, "0")}
			>
				<span className="text-primary">thread:</span>
				{group.division === "tools" ? "Tools" : "Education"}
			</SectionLabel>

			{group.items.map((product) => (
				<ProductCard key={product.slug} product={product} />
			))}
			{mediumEmptySlots > 0 && (
				<DocsCallout className="hidden sm:flex sm:col-span-1 lg:hidden" />
			)}
			{largeEmptySlots > 0 && (
				<DocsCallout
					className={cn(
						"hidden lg:flex",
						largeEmptySlots === 1 ? "lg:col-span-1" : "lg:col-span-2",
					)}
				/>
			)}
		</section>
	);
}
