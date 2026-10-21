import { cn } from "~/lib/utils";

/**
 * Where the crosshair sits on its parent frame: the CENTER of that edge.
 * `top` = middle of the top rule, `left` = middle of the left rule, and so
 * on. The parent must be `relative` (or positioned) for the crosshair to
 * anchor against.
 */
export type CrosshairSide = "top" | "right" | "bottom" | "left";

/** One centering rule per edge — shared by every call site. */
const SIDE_CLASS: Record<CrosshairSide, string> = {
	top: "-top-1.75 left-1/2 -translate-x-1/2",
	right: "top-1/2 -right-1.75 -translate-y-1/2",
	bottom: "-bottom-1.75 left-1/2 -translate-x-1/2",
	left: "top-1/2 -left-1.75 -translate-y-1/2",
};

/**
 * Drafting-crosshair marker used on the landing-style hero frames. Shared
 * (previously copy-pasted across five routes) so the geometry stays identical
 * everywhere.
 *
 * Crosshairs sit at the CENTER of a frame's edges — four marks, one per edge,
 * reading as alignment targets on the rules themselves — rather than the
 * earlier corner cluster, which crowded the frame's corners without marking
 * the actual edge lines.
 */
export function Crosshair({
	side,
	className,
}: {
	side: CrosshairSide;
	className?: string;
}) {
	return (
		<svg
			className={cn(
				"pointer-events-none absolute h-3.5 w-3.5 animate-crosshair text-muted-foreground/70",
				SIDE_CLASS[side],
				className,
			)}
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.2"
			aria-hidden="true"
		>
			<line x1="7" y1="0" x2="7" y2="14" />
			<line x1="0" y1="7" x2="14" y2="7" />
		</svg>
	);
}

/**
 * The full edge set of one frame: one crosshair at the center of each edge,
 * in a fixed order so every frame reads the same.
 */
export function FrameCrosshairs({ className }: { className?: string }) {
	return (
		<>
			{(["top", "right", "bottom", "left"] as const).map((side) => (
				<Crosshair className={className} key={side} side={side} />
			))}
		</>
	);
}
