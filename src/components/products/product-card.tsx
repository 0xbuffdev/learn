import { ArrowRight, ArrowUpRight } from "lucide-react";
import type * as React from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { CornerMarks, FRAME_CELL } from "~/components/frame";
import { StatusLabel } from "~/components/process-status";
import {
	type Product,
	productDestination,
	productLink,
} from "~/lib/products";
import { ROUTES } from "~/lib/site";

/**
 * The product cell used on the docs index.
 *
 * The cell carries three things and nothing else: the product's title, one
 * short description, and its status. The rest of the detail lives on the
 * product's own page, so the index stays a scannable catalogue instead of a
 * second copy of every product page.
 *
 * Where a card points, what its destination reads, and how it is announced all
 * come from `productLink()` / `productDestination()` — so a card can never
 * send a visitor somewhere its own accessible name did not describe.
 */

const CELL_BODY =
	"flex flex-col self-stretch p-6 outline-none transition-colors duration-300 md:p-8 focus-visible:bg-primary/[0.05]";

/** The hover sheen that sits under a cell's content on hover/focus. */
const SHEEN = cn(
	"pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500",
	"group-hover:opacity-100",
	// Not a token: a one-off tinted sweep anchored at the card's top-left
	// corner, so it reads as light entering the cell rather than an overlay.
	"bg-[radial-gradient(120%_80%_at_0%_0%,color-mix(in_oklch,var(--primary)_9%,transparent),transparent_60%)]",
);

export function ProductCard({ product }: { product: Product }) {
	const link = productLink(product);
	const destination = productDestination(product);
	const Arrow = link.external ? ArrowUpRight : ArrowRight;

	const content = (
		<>
			<span aria-hidden="true" className={SHEEN} />

			<span className="relative block text-balance font-semibold text-lg tracking-tight">
				{product.name}
			</span>
			<span className="relative mt-2 block text-pretty text-muted-foreground text-sm leading-relaxed">
				{product.tagline}
			</span>

			<span className="relative mt-6 flex items-center justify-between gap-3">
				<StatusLabel status={product.status} />
				<Arrow
					aria-hidden="true"
					className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:text-primary"
				/>
			</span>
			<CornerMarks />
		</>
	);

	// The card's visible text is the product's name, its tagline and its
	// status. The label repeats them for assistive tech — so it can describe
	// the whole cell rather than only its first word — and adds the one thing
	// the visible text cannot say: where the link goes.
	const description = product.tagline.replace(/[.\s]+$/, "");
	const label = `${product.name}. ${description}. Status: ${product.status}.`;

	if (link.external) {
		return (
			<a
				aria-label={`${label} Opens ${destination} in a new tab.`}
				className={cn(FRAME_CELL, CELL_BODY)}
				href={link.href}
				rel="noopener noreferrer"
				target="_blank"
			>
				{content}
			</a>
		);
	}

	return (
		<Link
			aria-label={`${label} ${link.label}.`}
			className={cn(FRAME_CELL, CELL_BODY)}
			to={link.href}
		>
			{content}
		</Link>
	);
}

/** A useful docs link for the unused slots at the end of a product grid. */
export function DocsCallout({ className }: { className?: string }) {
	return (
		<Link
			className={cn(
				FRAME_CELL,
				"flex w-full flex-col self-stretch p-5 text-muted-foreground transition-colors hover:bg-card/50 hover:text-foreground focus-visible:bg-primary/[0.05] md:p-6",
				className,
			)}
			to={ROUTES.docs}
		>
			<span className="relative block">
				<span className="block font-semibold text-foreground">
					Start with the docs.
				</span>
				<span className="mt-2 block text-sm leading-relaxed">
					Find setup guides, references, and practical examples.
				</span>
			</span>
			<span className="relative mt-5 inline-flex items-center gap-2 font-mono text-xs text-primary">
				Browse documentation
				<ArrowRight aria-hidden="true" className="size-3.5" />
			</span>
			<CornerMarks />
		</Link>
	);
}
