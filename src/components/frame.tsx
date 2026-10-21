import { cn } from "~/lib/utils";
import type { ReactNode } from "react";
import { DecodeText } from "~/components/decode-text";

/**
 * The 0xBUFF page frame vocabulary — dotted margins, dashed rails, and the
 * grid of cells every landing surface is built from. Ported from the 0xBUFF
 * marketing site (`apps/0xbuff/src/components/frame.tsx`) so the docs app
 * speaks the same layout language: pages centre themselves in one column,
 * full-width sections rule across the rails with a small square marker at
 * each rail crossing, and inside that column framed content is composed of
 * complementary hairlines (parent draws top+left, child draws right+bottom)
 * so the perimeter is drawn exactly once and interior rules never double.
 */

/**
 * The page column width — 72rem — as one token.
 *
 * Every full-width block on every page centres itself inside this column, and
 * {@link PageRails} draws the dashed rails on exactly its edges. Those are the
 * same number by construction, so they are declared once here rather than
 * spelled at every call site: a wider column in one component would push
 * content out past the rails and leave the page looking broken without
 * anything failing to compile.
 *
 * The `page-column` utility and `ruled` marker utility in `src/app.css` both
 * read `--rail-column`, so the component and CSS geometry stay in agreement.
 */
export const PAGE_COLUMN = "page-column";

/**
 * The horizontal page gutters — the inline padding that keeps *text* off the
 * rails. One token: framed sections put their HEADER LANE in these gutters
 * while framed content spans rail to rail.
 *
 * Framed content must NOT sit in these gutters: {@link SectionFrame} and its
 * cells span the rails edge-to-edge — padding lives inside the tiles and the
 * frame owns the outside border.
 */
export const PAGE_GUTTERS = "px-4 md:px-8";

/**
 * Fixed backdrop: dotted margins with dashed rails on the edges of the page
 * column. Mounted once per page, not per section — it is a fixed decoration,
 * so a second copy would just double the paint cost.
 */
export function PageRails() {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 -z-10 bg-dots"
		>
			<div
				className={cn(
					"mx-auto h-full border-border border-x border-dashed bg-background",
					PAGE_COLUMN,
				)}
			/>
		</div>
	);
}

const MARK_CLASS =
	"pointer-events-none absolute z-10 size-[9px] border bg-background transition-colors duration-300";

/**
 * Square markers on all four corners of a grid cell; neighbours overlap
 * exactly, so a run of cells reads as one bracketed block rather than a grid
 * of individually boxed tiles.
 */
export function CornerMarks({ active = false }: { active?: boolean }) {
	const tone = active
		? "border-primary"
		: "border-foreground/20 group-hover:border-primary group-focus-visible:border-primary";
	return (
		<>
			<span
				aria-hidden="true"
				className={cn(MARK_CLASS, tone, "-top-[5px] -left-[5px]")}
			/>
			<span
				aria-hidden="true"
				className={cn(MARK_CLASS, tone, "-top-[5px] -right-[5px]")}
			/>
			<span
				aria-hidden="true"
				className={cn(MARK_CLASS, tone, "-bottom-[5px] -left-[5px]")}
			/>
			<span
				aria-hidden="true"
				className={cn(MARK_CLASS, tone, "-bottom-[5px] -right-[5px]")}
			/>
		</>
	);
}

/**
 * Grid wrapper where each child cell draws its own right/bottom border, so
 * the grid reads as ruled cells rather than a stack of separately outlined
 * boxes. Cells must therefore use {@link FRAME_CELL}.
 */
export function FrameGrid({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return (
		<div className={cn("grid border-border border-l border-t", className)}>
			{children}
		</div>
	);
}

/**
 * The edge half of a framed child — right + bottom hairlines.
 *
 * Parent does top+left, child does right+bottom: the perimeter is drawn
 * exactly once and interior hairlines never double. Every child of
 * {@link SECTION_FRAME} must carry this (or {@link FRAME_CELL}, which is this
 * plus the `group` hook), cells or not — a full-width row is an edge-bearing
 * child just as much as a card is.
 */
export const FRAME_EDGE = "border-r border-b border-border";

/**
 * The interactive cell half of {@link FrameGrid}: {@link FRAME_EDGE} plus
 * `group` so {@link CornerMarks} can respond to hover and focus-visible on
 * the cell.
 */
export const FRAME_CELL = cn("group relative", FRAME_EDGE);

/**
 * The section-level frame — a full-column outlined box whose interior tiles
 * sit flush against it, zero margins between tile and border.
 *
 * {@link FrameGrid} draws top+left, {@link FRAME_CELL} draws right+bottom;
 * {@link SECTION_FRAME} is that same complementary pair at section scale, so
 * a frame can hold ANY mixed children and the perimeter is still drawn
 * exactly once, hairlines never double, and no cell ever draws its own outer
 * border.
 *
 * `w-full` is what makes the frame span rail to rail: it must be rendered in
 * a lane that is exactly the page column wide with no gutters. Inside a
 * gutter-padded column it would stop dead at the gutters instead.
 */
export const SECTION_FRAME = "w-full border-l border-t border-border";

/**
 * The component half of {@link SECTION_FRAME}, with a layout `className` slot
 * (`md:grid md:grid-cols-2`, a `flex flex-col` toolbar, …). Children supply
 * the edge half — {@link FRAME_EDGE}, or {@link FRAME_CELL} when interactive.
 */
export function SectionFrame({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return <div className={cn(SECTION_FRAME, className)}>{children}</div>;
}

/**
 * The one definition of a full-bleed band rule: a hairline across the entire
 * viewport that crosses the page rails and drops a small square marker at each
 * crossing (the `ruled` utility in `src/app.css`).
 *
 * Everything else in this file is built on it, and so is every full-width
 * section on the site — the marker geometry lives in exactly one place.
 *
 * The rule can only be computed against the *section's* own width, so an
 * element carrying this must be FULL BLEED: a `max-w-*` here stops the rule
 * dead at the rails instead of passing through them, and the marker lands on
 * nothing. That constraint is why {@link RuledSection} puts the width on an
 * inner wrapper rather than on the band itself.
 */
export const RULED_BAND = "ruled border-b border-border";

/**
 * The same rule on the element's TOP edge, for a band that begins below another.
 */
export const RULED_BAND_TOP = "ruled-top border-t border-border";

/**
 * A full-bleed band: {@link RULED_BAND}, with its content in the page column.
 *
 * This is the default way to render a section — reach for it rather than
 * composing a `<section className="border-b">` by hand, because a hand-rolled
 * one is a rule that crosses the rails with no marker on it.
 */
export function RuledSection({
	children,
	contentClassName,
	className,
	id,
}: {
	children: ReactNode;
	/** Classes for the inner content column. Pass a `max-w-*` to narrow it. */
	contentClassName?: string;
	className?: string;
	id?: string;
}) {
	return (
		<section className={cn(RULED_BAND, className)} id={id}>
			<div
				className={cn("mx-auto", PAGE_GUTTERS, PAGE_COLUMN, contentClassName)}
			>
				{children}
			</div>
		</section>
	);
}

/**
 * A home-page section: a full-bleed ruled band, split in two lanes.
 *
 * - The **header lane** sits in the guttered page column ({@link PAGE_GUTTERS})
 *   and owns the band's top rhythm — plain text only, never a frame.
 * - The **frame lane** is exactly the {@link PAGE_COLUMN} width with no
 *   gutters, so a `SectionFrame` child reaches the rails edge-to-edge and its
 *   tiles sit flush against the frame border.
 *
 * The lane also **welds** the frame to the band: no spacer below, and a 1px
 * negative bottom margin. The frame's last row draws its own bottom hairline
 * exactly where the band's full-bleed bottom rule sits, so tile bottom and
 * section bottom are the same pixel line.
 *
 * `overflow-x-clip` is load-bearing, not decoration: a cell's corner marks
 * hang 5px past the frame edge, and while the band is narrower than the rail
 * column the frame touches the viewport edge, so the outer half of a mark at
 * the frame's corner would overflow the viewport without it.
 */
export function SectionContainer({
	id,
	header,
	children,
}: {
	id?: string;
	header: ReactNode;
	children: ReactNode;
}) {
	return (
		<section className={cn("scroll-mt-14 overflow-x-clip", RULED_BAND)} id={id}>
			<div
				className={cn(
					"mx-auto pt-20 md:pt-28",
					PAGE_GUTTERS,
					PAGE_COLUMN,
				)}
			>
				{header}
			</div>
			<div className={cn("mx-auto -mb-px mt-14 w-full", PAGE_COLUMN)}>
				{children}
			</div>
		</section>
	);
}

/**
 * The numbered mono label above a heading (`01 · Child processes`).
 * Rendered as a `<p>`, not a heading, so the section title stays the sole
 * `<h2>` in the section's outline.
 */
export function SectionKicker({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<p
			className={cn(
				"font-mono text-primary text-xs uppercase tracking-widest",
				className,
			)}
		>
			{children}
		</p>
	);
}

/** Body copy under a section heading or in a section's left column. */
export function SectionDescription({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<p
			className={cn(
				"text-pretty text-muted-foreground leading-relaxed",
				className,
			)}
		>
			{children}
		</p>
	);
}

/**
 * The section `<h2>`, with the decode-on-scroll effect built in. Pass `plain`
 * for headings that must render identically on the server, where a scramble
 * would be read as a flash of garbage.
 */
export function SectionTitle({
	children,
	className,
	plain = false,
}: {
	children: string;
	className?: string;
	plain?: boolean;
}) {
	return (
		<h2
			className={cn(
				"mt-4 text-balance font-bold font-display text-3xl tracking-tight md:text-5xl",
				className,
			)}
		>
			{plain ? children : <DecodeText text={children} />}
		</h2>
	);
}

/**
 * The canonical heading block: kicker, title, and optional trailing copy.
 *
 * `align="split"` puts the prose in a right-hand column (used where the prose
 * answers the heading rather than elaborating it); `align="stacked"` keeps
 * everything in one left-aligned column.
 */
export function SectionHeader({
	align = "stacked",
	description,
	descriptionClassName,
	kicker,
	plain = false,
	title,
}: {
	align?: "stacked" | "split";
	description?: string;
	descriptionClassName?: string;
	kicker: string;
	plain?: boolean;
	title: string;
}) {
	if (align === "split") {
		return (
			<div
				className={cn(
					"flex flex-col justify-between gap-6 md:flex-row md:items-end",
				)}
			>
				<div>
					<SectionKicker>{kicker}</SectionKicker>
					<SectionTitle plain={plain}>{title}</SectionTitle>
				</div>
				{description && (
					<SectionDescription
						className={cn("max-w-sm", descriptionClassName)}
					>
						{description}
					</SectionDescription>
				)}
			</div>
		);
	}

	return (
		<div>
			<SectionKicker>{kicker}</SectionKicker>
			<SectionTitle plain={plain}>{title}</SectionTitle>
			{description && (
				<SectionDescription className={cn("mt-6 max-w-2xl", descriptionClassName)}>
					{description}
				</SectionDescription>
			)}
		</div>
	);
}

/**
 * The masthead shared by framed pages.
 *
 * The eyebrow, decoding title, description and optional children are the same
 * triad everywhere, and every masthead wants the ruled rail and the staggered
 * entrance, so the entrance lives here rather than at each call site — a page
 * cannot ship a hero that does not animate.
 */
export function PageHero({
	description,
	eyebrow,
	title,
	children,
}: {
	description: ReactNode;
	eyebrow: ReactNode;
	title: string;
	children?: ReactNode;
}) {
	return (
		<RuledSection contentClassName="flex max-w-4xl flex-col items-center px-4 pb-14 pt-20 text-center md:pb-20 md:pt-28">
			<p className="animate-rise font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
				{eyebrow}
			</p>
			<h1 className="mt-6 text-balance font-bold font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
				<DecodeText text={title} />
			</h1>
			<p
				className="animate-rise mt-6 max-w-xl text-pretty text-base text-muted-foreground leading-relaxed md:text-lg"
				style={{ animationDelay: "120ms" }}
			>
				{description}
			</p>
			{children && (
				<div
					className="animate-rise mt-10 w-full"
					style={{ animationDelay: "220ms" }}
				>
					{children}
				</div>
			)}
		</RuledSection>
	);
}

/**
 * A full-width heading row inside a {@link SectionFrame}. Its edge completes
 * the parent's left/top outline and keeps the divider shared with the next
 * row. The h2 keeps section labels in the document outline.
 */
export function SectionLabel({
	children,
	id,
	meta,
}: {
	children: ReactNode;
	id: string;
	meta?: ReactNode;
}) {
	return (
		<div
			className={cn(
				FRAME_EDGE,
				"col-span-full flex items-baseline justify-between gap-4 px-4 py-3",
				"font-mono text-xs uppercase tracking-[0.2em]",
			)}
		>
			<h2 className="text-muted-foreground" id={id}>
				{children}
			</h2>
			{meta && <span className="text-muted-foreground/60">{meta}</span>}
		</div>
	);
}
