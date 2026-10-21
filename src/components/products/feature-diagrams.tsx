import type * as React from "react";
import { cn } from "~/lib/utils";

/**
 * Per-feature blueprint illustrations — the small diagrams that sit inside a
 * product page's feature cells, in the style of the MemoFS docs landing
 * feature cards: a single 160×160 stroke drawing, no text, one dashed guide
 * or filled token face per idea, and at most one primary-coloured accent.
 *
 * The colour contract is deliberately thin: the root carries `stroke-current`
 * and the call site sets the text colour (muted, foreground on hover), so all
 * strokes follow the cell's state. Fills are token classes (`fill-muted`,
 * `fill-foreground`) and stay constant. `strokeWidth` is inherited from the
 * root; a shape that wants emphasis overrides it locally.
 *
 * The registry maps catalogue order (product slug → feature index) to a
 * diagram. An unmapped combination falls back to {@link ModuleDiagram}, so a
 * new feature renders the cell pattern immediately instead of a broken image.
 */

type DiagramProps = {
	/** Layout slot for the sizing/centring the call site wants. */
	className?: string;
};

type DiagramComponent = (props: DiagramProps) => React.JSX.Element;

const DIAGRAMS: Record<string, Record<number, DiagramComponent> | undefined> = {
	memofs: { 0: InspectDiagram, 1: LocalDiagram, 2: AgentDoorsDiagram },
	buildtrace: { 0: InventoryDiagram, 1: EvidenceDiagram, 2: PolicyDiagram },
	"0xnand": { 0: GatesDiagram, 1: ProjectsDiagram },
};

/** The illustration for one feature cell, picked by catalogue position. */
export function FeatureDiagram({
	className,
	index,
	slug,
}: {
	className?: string;
	/** The feature's position in its product's feature list (0-based). */
	index: number;
	/** The product's catalogue slug. */
	slug: string;
}): React.JSX.Element {
	const Diagram = DIAGRAMS[slug]?.[index] ?? ModuleDiagram;
	return <Diagram className={className} />;
}

/** MemoFS 01 — memory is files: a document you can open, with a diff beside it. */
function InspectDiagram({ className }: DiagramProps): React.JSX.Element {
	return (
		<svg
			aria-hidden="true"
			className={cn("stroke-current", className)}
			fill="none"
			strokeWidth={1.2}
			viewBox="0 0 160 160"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect height="82" width="54" x="64" y="20" />
			<rect className="fill-muted" height="90" width="54" x="50" y="34" />
			<rect className="fill-muted" height="8" width="16" x="54" y="26" />
			<path d="M58 52h38" strokeOpacity="0.5" />
			<path d="M58 62h26" strokeOpacity="0.5" />
			<path d="M58 72h34" strokeOpacity="0.5" />
			<path d="M58 82h18" strokeOpacity="0.5" />
			{/* The review column: every change shows as a plus or a minus. */}
			<path d="M122 52h8M126 48v8" />
			<path d="M122 72h8" />
			<path d="M122 92h8M126 88v8" />
			<circle cx="94" cy="100" r="12" />
			<path d="M102 108l9 8" />
		</svg>
	);
}

/** MemoFS 02 — local only: a store beside a config file, no database in reach. */
function LocalDiagram({ className }: DiagramProps): React.JSX.Element {
	return (
		<svg
			aria-hidden="true"
			className={cn("stroke-current", className)}
			fill="none"
			strokeWidth={1.2}
			viewBox="0 0 160 160"
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* The one thing the runtime needs where the project is. */}
			<rect height="28" width="24" x="26" y="22" />
			<path d="M30 32h16M30 40h12" strokeOpacity="0.5" />
			<path d="M34 52L56 68" strokeDasharray="3 3" />
			<circle cx="112" cy="88" r="3" />
			<path d="M90 88h18" strokeDasharray="3 3" />
			{/* The database that isn't part of the picture. */}
			<ellipse cx="118" cy="38" rx="14" ry="5" />
			<ellipse cx="118" cy="58" rx="14" ry="5" />
			<path d="M104 38v20M132 38v20" />
			<path className="stroke-primary" d="M102 66L134 30" />
			{/* The store: plain files on the local disk. */}
			<path className="fill-muted" d="M62 62L90 76L62 90L34 76Z" />
			<path d="M34 76L34 102L62 116L62 90Z" />
			<path d="M90 76L90 102L62 116L62 90Z" />
		</svg>
	);
}

/** MemoFS 03 — three doors, one store: agent, MCP/SDK/CLI, then plain files. */
function AgentDoorsDiagram({ className }: DiagramProps): React.JSX.Element {
	return (
		<svg
			aria-hidden="true"
			className={cn("stroke-current", className)}
			fill="none"
			strokeWidth={1.2}
			viewBox="0 0 160 160"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect height="18" width="18" x="14" y="36" />
			<rect height="18" width="18" x="14" y="71" />
			<rect height="18" width="18" x="14" y="106" />
			<circle className="fill-foreground" cx="23" cy="45" r="2" />
			<circle className="fill-foreground" cx="23" cy="80" r="2" />
			<circle className="fill-foreground" cx="23" cy="115" r="2" />
			<path d="M32 45L76 74" strokeDasharray="3 3" />
			<path d="M32 80h44" strokeDasharray="3 3" />
			<path d="M32 115L76 86" strokeDasharray="3 3" />
			{/* One store behind every door. */}
			<rect className="fill-muted" height="36" width="30" x="76" y="62" />
			<rect height="20" width="16" x="83" y="70" strokeOpacity="0.6" />
			<path d="M106 80h16" />
			<path d="M122 76l4 4-4 4" />
			{/* What it all becomes: files. */}
			<rect height="32" width="18" x="130" y="56" />
			<rect className="fill-muted" height="32" width="16" x="136" y="70" />
			<path d="M140 82h8M140 88h6" strokeOpacity="0.5" />
		</svg>
	);
}

/** BuildTrace 01 — the inventory: what build-time code a dependency graph carries. */
function InventoryDiagram({ className }: DiagramProps): React.JSX.Element {
	return (
		<svg
			aria-hidden="true"
			className={cn("stroke-current", className)}
			fill="none"
			strokeWidth={1.2}
			viewBox="0 0 160 160"
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Typical crate (circle) vs build script (square). */}
			<rect className="fill-muted" height="16" width="16" x="72" y="16" />
			{/* Nothing is executed to see it. */}
			<path d="M30 16v14l11-7z" />
			<path className="stroke-primary" d="M26 32L44 14" />
			<path d="M74 32L44 58" />
			<path d="M80 32v23" />
			<path d="M86 32L118 58" />
			<circle cx="42" cy="66" r="9" />
			<rect className="fill-muted" height="18" width="18" x="71" y="55" />
			<circle className="fill-foreground" cx="80" cy="64" r="2" />
			<circle cx="120" cy="66" r="9" />
			<path d="M80 73v29" strokeDasharray="3 3" />
			{/* What the inventory reads out. */}
			<rect height="38" width="84" x="46" y="102" />
			<path d="M54 113h34" strokeOpacity="0.5" />
			<path d="M54 121h52" strokeOpacity="0.5" />
			<path d="M54 129h40" strokeOpacity="0.5" />
		</svg>
	);
}

/** BuildTrace 02 — the evidence: attributed operations, one row under a lens. */
function EvidenceDiagram({ className }: DiagramProps): React.JSX.Element {
	return (
		<svg
			aria-hidden="true"
			className={cn("stroke-current", className)}
			fill="none"
			strokeWidth={1.2}
			viewBox="0 0 160 160"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect height="72" width="94" x="18" y="48" />
			<rect className="fill-muted" height="16" width="94" x="18" y="76" />
			<circle cx="26" cy="64" r="2.5" />
			<circle className="fill-foreground" cx="26" cy="84" r="2.5" />
			<circle cx="26" cy="104" r="2.5" />
			<path d="M34 64h50" strokeOpacity="0.5" />
			<path d="M34 84h44" strokeOpacity="0.5" />
			<path d="M34 104h50" strokeOpacity="0.5" />
			{/* The event under review, traced back to its source. */}
			<circle cx="90" cy="84" r="11" />
			<path d="M97 91l8 8" />
			<path d="M112 84h12" strokeDasharray="3 3" />
			<rect className="fill-muted" height="20" width="24" x="124" y="74" />
			<path d="M130 79h12M130 85h8" strokeOpacity="0.5" />
		</svg>
	);
}

/** BuildTrace 03 — the gate: a changed policy fails the build before it ships. */
function PolicyDiagram({ className }: DiagramProps): React.JSX.Element {
	return (
		<svg
			aria-hidden="true"
			className={cn("stroke-current", className)}
			fill="none"
			strokeWidth={1.2}
			viewBox="0 0 160 160"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect height="42" width="30" x="16" y="46" />
			<rect className="fill-muted" height="42" width="30" x="28" y="54" />
			<path d="M34 66h18M34 74h14M34 82h18" strokeOpacity="0.5" />
			{/* The diff a dependency update proposes. */}
			<path d="M68 62h8M72 58v8" />
			<path d="M68 76h8M72 72v8" />
			<path d="M68 90h8" />
			<path d="M82 78h20" />
			<path d="M100 74l4 4-4 4" />
			{/* CI: the new access does not pass. */}
			<rect className="fill-muted" height="72" width="6" x="110" y="42" />
			<path className="stroke-primary" d="M107 24l12 12M119 24l-12 12" />
		</svg>
	);
}

/** 0xnand 01 — the climb: one gate, wired through arithmetic, into a CPU. */
function GatesDiagram({ className }: DiagramProps): React.JSX.Element {
	return (
		<svg
			aria-hidden="true"
			className={cn("stroke-current", className)}
			fill="none"
			strokeWidth={1.2}
			viewBox="0 0 160 160"
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* The only part you're given: NAND. */}
			<path d="M20 54h14a9 9 0 0 1 0 18h-14z" />
			<circle cx="46" cy="63" r="3" />
			<path d="M10 57h10M10 69h10" />
			<path d="M49 63h11" />
			<path d="M60 63h17v19" strokeDasharray="3 3" />
			<circle className="fill-foreground" cx="77" cy="63" r="1.5" />
			{/* Built up from it, one project at a time. */}
			<rect height="26" width="26" x="64" y="82" />
			<path d="M73 95h8M77 91v8" />
			<path d="M90 95h26v-17" strokeDasharray="3 3" />
			<circle className="fill-foreground" cx="116" cy="95" r="1.5" />
			{/* The machine that runs your programs. */}
			<rect height="36" width="36" x="92" y="36" />
			<rect className="fill-muted" height="20" width="20" x="100" y="44" />
			<path d="M100 30v6M116 30v6" />
			<path d="M100 72v6M116 72v6" />
			<path d="M86 44h6M86 60h6" />
			<path d="M128 44h6M128 60h6" />
		</svg>
	);
}

/** 0xnand 02 — progress is a passing build: graded scaffolds, row after row. */
function ProjectsDiagram({ className }: DiagramProps): React.JSX.Element {
	return (
		<svg
			aria-hidden="true"
			className={cn("stroke-current", className)}
			fill="none"
			strokeWidth={1.2}
			viewBox="0 0 160 160"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect height="92" width="120" x="20" y="24" />
			<path d="M20 40h120" />
			<circle className="fill-foreground" cx="28" cy="32" r="1.5" />
			<circle className="fill-foreground" cx="34" cy="32" r="1.5" />
			<circle className="fill-foreground" cx="40" cy="32" r="1.5" />
			{/* Graded by the tests, not by a watched video. */}
			<rect className="fill-muted" height="12" width="12" x="30" y="50" />
			<path d="M33 56l3 3 5-6" />
			<path d="M56 56h48" strokeOpacity="0.5" />
			<rect className="fill-muted" height="12" width="12" x="30" y="72" />
			<path d="M33 78l3 3 5-6" />
			<path d="M56 78h36" strokeOpacity="0.5" />
			<rect height="12" width="12" x="30" y="94" />
			<path d="M33.5 100h5" strokeOpacity="0.4" />
			<path d="M56 100h44" strokeOpacity="0.5" />
			{/* Where the current build has reached. */}
			<rect height="12" width="120" x="20" y="126" />
			<rect className="fill-muted" height="12" width="64" x="20" y="126" />
		</svg>
	);
}

/** The fallback for features that don't have an authored diagram yet. */
function ModuleDiagram({ className }: DiagramProps): React.JSX.Element {
	return (
		<svg
			aria-hidden="true"
			className={cn("stroke-current", className)}
			fill="none"
			strokeWidth={1.2}
			viewBox="0 0 160 160"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path className="fill-muted" d="M80 52L108 66L80 80L52 66Z" />
			<path d="M52 66L52 92L80 106L80 80Z" />
			<path d="M108 66L108 92L80 106L80 80Z" />
		</svg>
	);
}
