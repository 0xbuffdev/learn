import { Check, Copy } from "lucide-react";
import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import type { ProductInstall } from "~/lib/products";
import { cn } from "~/lib/utils";

type InstallCommandTabsProps = {
	/** The product's direct install command and optional agent-skill command. */
	install: ProductInstall;
	/** Show audience tabs only when this product offers an agent skill. */
	hasSkill: boolean;
	/** Layout slot for the width/positioning the call site wants. */
	className?: string;
};

type Audience = "human" | "agent";

const AUDIENCES = ["human", "agent"] as const satisfies readonly Audience[];
const AUDIENCE_LABELS: Record<Audience, string> = {
	human: "Human",
	agent: "Agent",
};

/**
 * The install command strip — one slim bar with optional Human/Agent controls,
 * a mono command line, and a copy affordance. Products without an agent skill
 * show only their direct install command.
 *
 * Switching audience is plain client state: the active segment fills with the
 * primary colour and the command line reads from the corresponding product
 * field. Long commands scroll inside the line without a visible scrollbar;
 * the soft edge fade signals that more text is available.
 */
export function InstallCommandTabs({
	install,
	hasSkill,
	className,
}: InstallCommandTabsProps): React.JSX.Element | null {
	const [audience, setAudience] = useState<Audience>("human");
	const [copied, setCopied] = useState(false);
	const [scrollEdges, setScrollEdges] = useState({ left: false, right: false });
	const commandScrollRef = useRef<HTMLDivElement>(null);

	const showAudienceTabs = Boolean(install?.human && hasSkill && install.agent);

	// If the active audience just vanished from the data, derive a fallback
	// instead of setting state during render.
	const active = showAudienceTabs ? audience : "human";
	const command =
		active === "agent"
			? install.agent
			: install.human;


	useEffect(() => {
		const element = commandScrollRef.current;
		if (!element) return;

		const updateScrollEdges = () => {
			const left = element.scrollLeft > 1;
			const right = element.scrollLeft + element.clientWidth < element.scrollWidth - 1;
			setScrollEdges((current) =>
				current.left === left && current.right === right
					? current
					: { left, right },
			);
		};
		const observer = new ResizeObserver(updateScrollEdges);
		observer.observe(element);
		element.addEventListener("scroll", updateScrollEdges, { passive: true });
		updateScrollEdges();

		return () => {
			observer.disconnect();
			element.removeEventListener("scroll", updateScrollEdges);
		};
	}, [command]);

	if (!install?.human) return null;

	async function copyCommand() {
		if (!command) return;
		try {
			await navigator.clipboard.writeText(command);
		} catch {
			// Clipboard refusal (permissions, non-secure context) is not fatal;
			// the command is selectable text either way.
			return;
		}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1600);
	}

	return (
		<div
			aria-label="Install command"
			className={cn(
				"flex items-stretch border bg-muted/30 border-border",
				className,
			)}
			role="group"
		>
			{showAudienceTabs && (
				<div
					aria-label="Choose setup instructions"
					className="flex items-stretch"
					role="group"
				>
					{AUDIENCES.map((option) => (
						<button
							aria-pressed={active === option}
							className={cn(
								"flex items-center px-3 font-mono text-[10px] tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50",
								option === "human" && "border-r border-border",
								active === option
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
							id={`install-tab-${option}`}
							key={option}
							onClick={() => setAudience(option)}
							type="button"
						>
							{AUDIENCE_LABELS[option]}
						</button>
					))}
				</div>
			)}
			<div
				aria-live="polite"
				className={cn(
					"flex min-w-0 flex-1 items-center gap-2.5 px-4 py-2.5",
					showAudienceTabs && "border-l border-border",
				)}
			>
				<span aria-hidden="true" className="font-mono text-primary text-xs">
					$
				</span>
				<div className="relative min-w-0 flex-1">
					<div
						aria-label="Install command; scroll horizontally to read the full command"
						className="min-w-0 overflow-x-auto font-mono text-foreground text-xs whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring/50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:text-[13px]"
						ref={commandScrollRef}
						role="region"
						tabIndex={0}
					>
						<code className="block w-max min-w-full pr-6">{command}</code>
					</div>
					{scrollEdges.left && (
						<span
							aria-hidden="true"
							className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-muted/30 to-transparent"
						/>
					)}
					{scrollEdges.right && (
						<span
							aria-hidden="true"
							className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-muted/30 to-transparent"
						/>
					)}
				</div>
			</div>
			<button
				aria-label={copied ? "Command copied" : "Copy command"}
				className="flex shrink-0 items-center border-l border-border px-3 text-muted-foreground transition-colors hover:text-foreground"
				onClick={copyCommand}
				type="button"
			>
				{copied ? (
					<Check aria-hidden="true" className="size-3.5" />
				) : (
					<Copy aria-hidden="true" className="size-3.5" />
				)}
			</button>
		</div>
	);
}
