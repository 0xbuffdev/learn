import { Button } from "~/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import type * as React from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import {
	CornerMarks,
	FRAME_CELL,
	FRAME_EDGE,
	PAGE_COLUMN,
	PAGE_GUTTERS,
	RULED_BAND,
	SectionFrame,
} from "~/components/frame";
import { FeatureDiagram } from "~/components/products/feature-diagrams";
import { InstallCommandTabs } from "~/components/install-command-tabs";
import { DecodeText } from "~/components/decode-text";
import { StatusLabel } from "~/components/process-status";
import { ProductIcon } from "~/components/product-icon";
import { GithubMark } from "~/components/brand-icons/github-mark";
import type { Product } from "~/lib/products";

type ProductSectionProps = {
	product: Product;
};

type ProductHeroProps = ProductSectionProps & {
	description: string;
};

/**
 * The product detail page's bands, in reading order.
 *
 * The page is deliberately short on ceremony: after the name and the
 * description, the next thing a reader meets is the features — what the
 * product is used for — the way the MemoFS docs landing presents its own
 * capabilities (a plain grid of titled, illustrated cards). No section
 * headlines sit between the bands; each band is identified by what is in it.
 * Every frame spans the rails edge to edge and welds to the previous band's
 * rule, so the grid always fills the column with the rails as its borders.
 */

/**
 * The hero band pairs product identity, description, actions, and installation
 * on the left with a data-driven preview of the first authored feature on the
 * right.
 * Both sides come from the product catalogue, so the visual stays in sync as
 * product details change. The documentation CTA is primary; source is
 * secondary; the install command stays one line tall.
 */

function ProductHeroPreview({
	product,
}: ProductSectionProps): React.JSX.Element | null {
	const feature = product.features?.[0];
	if (!feature) return null;

	const { demo } = feature;
	const previewTitle = demo.title ?? feature.title;

	return (
		<figure className="animate-rise group relative ml-auto w-full max-w-xl border border-border bg-card/60 shadow-sm">
			<div className="flex min-h-12 items-center justify-between gap-4 border-b border-border px-4 sm:px-5">
				<div className="flex min-w-0 items-center gap-2.5 font-mono text-xs">
					<span aria-hidden="true" className="size-2 shrink-0 bg-primary" />
					<span className="truncate">{previewTitle}</span>
				</div>
				<span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
					{demo.kind === "code" ? demo.language : "flow"}
				</span>
			</div>

			{demo.kind === "code" ? (
				<div className="flex min-h-[21rem] items-center overflow-hidden px-4 py-6 sm:px-6">
					<pre className="max-w-full overflow-x-auto font-mono text-[11px] text-muted-foreground leading-[1.8] sm:text-xs">
						<code>{demo.code}</code>
					</pre>
				</div>
			) : (
				<div className="flex min-h-[21rem] flex-col justify-center gap-5 px-4 py-6 sm:px-6">
					<ol className="space-y-2.5">
						{demo.steps.map((step, index) => (
							<li
								className="flex items-center gap-3 border border-border/80 bg-background/70 px-3 py-2.5"
								key={`${step.label}-${index}`}
							>
								<span className="font-mono text-[10px] text-primary">
									{String(index + 1).padStart(2, "0")}
								</span>
								<span className="min-w-0">
									<span className="block font-mono text-xs">{step.label}</span>
									{step.sub && (
										<span className="mt-1 block text-xs text-muted-foreground">
											{step.sub}
										</span>
									)}
								</span>
							</li>
						))}
					</ol>
					{demo.caption && (
						<p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
							{demo.caption}
						</p>
					)}
				</div>
			)}

			<figcaption className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 sm:px-5">
				<span className="truncate text-xs text-muted-foreground">
					{feature.title}
				</span>
				<span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-primary">
					Feature 01
				</span>
			</figcaption>
			<CornerMarks />
		</figure>
	);
}

export function ProductHero({
	product,
	description,
}: ProductHeroProps): React.JSX.Element {
	const ctaHref = product.docsUrl ?? product.url ?? product.repository;
	const ctaExternal = ctaHref?.startsWith("http") ?? false;
	const ctaLabel = product.docsUrl
		? "Open the documentation"
		: product.url
			? `Visit ${product.name}`
			: "Read the source";

	return (
		<section className={cn("overflow-x-clip", RULED_BAND)}>
			<div
				className={cn(
					"mx-auto grid w-full items-center gap-10 pb-12 pt-10 md:gap-12 md:pb-16 md:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.92fr)]",
					PAGE_GUTTERS,
					PAGE_COLUMN,
				)}
			>
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-3">
						<span className="flex size-9 items-center justify-center border border-border bg-card text-primary">
							<ProductIcon slug={product.slug} />
						</span>
						<StatusLabel status={product.status} />
						<span className="font-mono text-[11px] text-muted-foreground">
							PID {product.pid}
						</span>
					</div>

					<h1 className="mt-6 text-balance font-bold font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
						<DecodeText text={product.name} />
					</h1>

					<p
						className="animate-rise mt-5 max-w-xl text-pretty text-lg text-muted-foreground leading-relaxed"
						style={{ animationDelay: "120ms" }}
					>
						{description}
					</p>

					<div
						className="animate-rise mt-7 flex flex-wrap items-center gap-3"
						style={{ animationDelay: "200ms" }}
					>
						{ctaHref && (
							<Button asChild className="rounded-none" size="lg">
								{ctaExternal ? (
									<a
										href={ctaHref}
										rel="noopener noreferrer"
										target="_blank"
									>
										{ctaLabel} <ArrowUpRight aria-hidden="true" />
									</a>
								) : (
									<Link to={ctaHref}>
										{ctaLabel} <ArrowUpRight aria-hidden="true" />
									</Link>
								)}
							</Button>
						)}
						{product.repository && ctaHref !== product.repository && (
							<Button
								asChild
								className="rounded-none"
								size="lg"
								variant="outline"
							>
								<a
									href={product.repository}
									rel="noopener noreferrer"
									target="_blank"
								>
									<GithubMark /> Source
								</a>
							</Button>
						)}
					</div>

					{product.install && (
						<InstallCommandTabs
							className="animate-rise mt-6 w-full"
							hasSkill={product.hasSkill}
							install={product.install}
						/>
					)}
				</div>

				<ProductHeroPreview product={product} />
			</div>
		</section>
	);
}

/**
 * The features band — what the product is used for, as one grid of
 * illustrated cards, straight after the hero's description.
 *
 * The cards follow the MemoFS docs landing's feature section: a mono "feature
 * nn" label, a centred blueprint illustration, the title and a short
 * description. The grid matches the feature count, spans the rails edge to
 * edge with no gutters, and welds to the hero band's rule on top (the frame
 * draws no top border — that rule already exists) and to this band's own
 * full-bleed rule below via the 1px negative bottom margin.
 */
export function ProductFeatures({
	product,
}: ProductSectionProps): React.JSX.Element | null {
	const features = product.features ?? [];
	if (features.length === 0) return null;

	// The grid never ends a row on a hole: three-or-more features fill a
	// three-column row, fewer fill one of two columns.
	const columns = features.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2";

	return (
		<section className={cn("overflow-x-clip", RULED_BAND)} id="features">
			<div className={cn("mx-auto -mb-px w-full", PAGE_COLUMN)}>
				<SectionFrame className={cn("grid border-t-0", columns)}>
					{features.map((feature, index) => (
						<article
							className={cn(
								FRAME_CELL,
								"flex flex-col px-6 py-8 sm:px-8",
							)}
							key={feature.title}
						>
							<p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
								feature {String(index + 1).padStart(2, "0")}
							</p>
							<div className="my-8 flex h-44 items-center justify-center text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
								<FeatureDiagram
									className="size-36 transition-transform duration-500 group-hover:scale-105 sm:size-40"
									index={index}
									slug={product.slug}
								/>
							</div>
							<h3 className="text-lg font-semibold tracking-tight">
								{feature.title}
							</h3>
							<p className="mt-2 text-sm text-pretty text-muted-foreground leading-relaxed">
								{feature.description}
							</p>
							<CornerMarks />
						</article>
					))}
				</SectionFrame>
			</div>
		</section>
	);
}

/**
 * The factsheet band — the product at a glance, as ruled spec cells: one cell
 * per authored fact (release, language, platform, licence). The process
 * identity (pid, division) already opens the page in the hero, so the sheet
 * carries only what the record adds. No header: the mono labels in each row
 * are the sheet.
 */
export function ProductFactsheet({
	product,
}: ProductSectionProps): React.JSX.Element | null {
	if (!product.facts) return null;

	return (
		<section className={cn("overflow-x-clip", RULED_BAND)} id="factsheet">
			<div className={cn("mx-auto -mb-px w-full", PAGE_COLUMN)}>
				<SectionFrame className="border-t-0">
					<dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
						{product.facts.map((row) => (
							<div
								className={cn(
									FRAME_EDGE,
									"group flex min-h-24 flex-col justify-between gap-4 px-6 py-5 transition-colors hover:bg-muted/30 sm:px-5",
								)}
								key={row.label}
							>
								<dt className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
									{row.label}
								</dt>
								<dd className="font-mono text-sm">{row.value}</dd>
							</div>
						))}
					</dl>
				</SectionFrame>
			</div>
		</section>
	);
}
