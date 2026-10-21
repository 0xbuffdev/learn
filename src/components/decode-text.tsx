import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "~/lib/utils";

const GLYPHS = "0123456789ABCDEF";
const DURATION_MS = 900;
const FONTS_WAIT_MS = 600;

/** One measured character slot, relative to the scramble root box. */
type Slot = { left: number; top: number };

/**
 * Drives the scramble for {@link DecodeText}: measures one slot per character
 * from the real text's own line boxes in a settled font, then walks
 * `resolvedCount` from 0 to the string length across {@link DURATION_MS}.
 *
 * `scrambling` is live between the first measured frame and the last resolved
 * character. If the heading's box changes mid-decode (viewport change, late
 * font swap), the overlay would anchor to stale slots, so the hook snaps back
 * to the real text — which owns the won layout all along — and just stops.
 */
function useDecodeScramble(text: string): {
	ref: React.RefObject<HTMLSpanElement | null>;
	chars: string[];
	scrambling: boolean;
	resolvedCount: number;
	slots: Slot[];
} {
	const ref = useRef<HTMLSpanElement>(null);
	const [scrambling, setScrambling] = useState(false);
	const [resolvedCount, setResolvedCount] = useState(0);
	const [slots, setSlots] = useState<Slot[]>([]);
	const chars = useMemo(() => text.split(""), [text]);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		let frame = 0;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();

				void (async () => {
					// Measure with settled fonts; capped so a stalled font cannot
					// hold the heading hostage.
					await Promise.race([
						document.fonts.ready,
						new Promise((resolve) => setTimeout(resolve, FONTS_WAIT_MS)),
					]);
					if (!node.isConnected) return;
					const base = node.firstElementChild;
					const charsNode = base?.firstChild;
					if (!(base instanceof HTMLElement) || !(charsNode instanceof Text)) {
						return;
					}

					// Per-character slots, relative to this span's own box, so the
					// overlay survives scrolling (offsets are viewport-invariant).
					const rootRect = node.getBoundingClientRect();
					const measured = chars.map((_, i) => {
						const range = document.createRange();
						range.setStart(charsNode, i);
						range.setEnd(charsNode, i + 1);
						const rect = range.getBoundingClientRect();
						return {
							left: rect.left - rootRect.left,
							top: rect.top - rootRect.top,
						};
					});

					const startBox = { width: rootRect.width, height: rootRect.height };
					const start = performance.now();
					setSlots(measured);
					setScrambling(true);
					const step = (now: number) => {
						// The base text must not have rewrapped: both edges checked
						// because `text-wrap: balance` can change breaks under a
						// height-only change. Cheap — layout is clean at frame start.
						const box = node.getBoundingClientRect();
						if (
							box.width !== startBox.width ||
							box.height !== startBox.height
						) {
							setScrambling(false);
							return;
						}
						setResolvedCount(
							Math.floor(
								Math.min((now - start) / DURATION_MS, 1) * chars.length,
							),
						);
						if (now - start < DURATION_MS) {
							frame = requestAnimationFrame(step);
						} else {
							setScrambling(false);
						}
					};
					frame = requestAnimationFrame(step);
				})();
			},
			{ threshold: 0.6 },
		);
		observer.observe(node);
		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	}, [chars]);

	return { ref, chars, scrambling, resolvedCount, slots };
}

/**
 * Scrambles `text` from random hex glyphs into its real characters once the
 * element scrolls into view.
 *
 * The real text always owns the layout AND the accessibility tree: it renders
 * in the normal flow for the whole lifecycle and is made `text-transparent`
 * while the animation runs (never `invisible`, never swapped for a ghost
 * copy), while a `select-none aria-hidden` overlay paints one absolutely
 * positioned glyph per measured character slot on top of it (state in
 * {@link useDecodeScramble}).
 *
 * That combination is deliberate:
 *
 * - selecting or copying the heading yields the text exactly ONCE (earlier
 *   drafts put a `sr-only` copy behind an invisible base, so a selection
 *   picked up the sentence twice);
 * - screen readers read the real sentence immediately, never the glyph noise;
 * - wrapping, `text-wrap: balance`, and the space the heading occupies never
 *   change while it decodes — only the painted glyphs do.
 */
export function DecodeText({ text }: { text: string }) {
	const { ref, chars, scrambling, resolvedCount, slots } =
		useDecodeScramble(text);

	return (
		<span className="relative" ref={ref}>
			<span
				className={cn({
					// Layout never moves; only the paint is hidden while the
					// overlay carries the visible glyphs.
					"text-transparent": scrambling,
				})}
			>
				{text}
			</span>
			{scrambling && (
				<span aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
					{chars.map((char, i) => {
						const slot = slots[i];
						// Spaces draw nothing: the gap is the base text's own.
						if (char === " " || !slot) return null;
						return (
								<span
								// biome-ignore lint/suspicious/noArrayIndexKey: a fixed positional slot of a string that never reorders; identity is the character offset, and its text mutates every frame.
								key={i}
								className="absolute"
								style={{ left: slot.left, top: slot.top }}
							>
								{i < resolvedCount
									? char
									: GLYPHS[Math.floor(Math.random() * GLYPHS.length)]}
							</span>
						);
					})}
				</span>
			)}
		</span>
	);
}
