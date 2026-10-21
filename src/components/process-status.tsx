import { cn } from "~/lib/utils";
import type { ProcessStatus } from "~/lib/products";

/**
 * Process status — the dot and the word beside it.
 *
 * Ported from the 0xBUFF site (`apps/0xbuff/src/components/process-status.tsx`)
 * so a product's status reads the same on a card and on its product page.
 *
 * The label colour and the dot colour are declared together because they are
 * the same decision: which colour means "healthy" versus "not yet". Splitting
 * them is how a `beta` label ends up wearing the `running` colour.
 *
 * Each status owns a *visible* hue. The 0xBUFF site paints `beta` and `alpha`
 * with the `accent` token, which on this palette is a near-background neutral
 * (`color-mix(fg 6%, bg)`) — the label simply vanishes. Here every status
 * maps to a real colour: `running` is the brand orange, `beta` the green
 * "nearly stable" step, `alpha` the violet "experimental" step, and
 * `spawning` the muted "not open yet" one.
 */

/** Label colour per status. */
const STATUS_TEXT: Record<ProcessStatus, string> = {
	running: "text-primary",
	beta: "text-chart-3",
	alpha: "text-chart-2",
	spawning: "text-muted-foreground",
};

/** Dot colour per status — the same decision as the label, one shade over. */
const STATUS_DOT: Record<ProcessStatus, string> = {
	running: "bg-primary shadow-[0_0_8px_var(--primary)]",
	beta: "bg-chart-3",
	alpha: "bg-chart-2",
	spawning: "animate-pulse bg-muted-foreground",
};

export function StatusDot({ status }: { status: ProcessStatus }) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"inline-block size-1.5 shrink-0 rounded-full",
				STATUS_DOT[status],
			)}
		/>
	);
}

export function StatusLabel({
	status,
	className,
}: {
	status: ProcessStatus;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 font-display text-[11px] uppercase",
				STATUS_TEXT[status],
				className,
			)}
		>
			<StatusDot status={status} />
			{status}
		</span>
	);
}
