import {
	CircleDashed,
	Cpu,
	Files,
	ScanSearch,
	type LucideIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";

/**
 * One icon per product, same glyph role the 0xBUFF site gives every card: an
 * icon that names the product's domain at a glance before its words are read.
 * Data lives here as a slug map rather than as a field on `Product` — the lib
 * is data, not presentation.
 */
const PRODUCT_ICONS: Record<string, LucideIcon> = {
	memofs: Files,
	buildtrace: ScanSearch,
	"0xnand": Cpu,
};

export function ProductIcon({
	slug,
	className,
}: {
	slug: string;
	className?: string;
}) {
	const Icon = PRODUCT_ICONS[slug] ?? CircleDashed;
	return (
		<Icon
			aria-hidden="true"
			className={cn("size-6 shrink-0 stroke-[1.5]", className)}
		/>
	);
}
