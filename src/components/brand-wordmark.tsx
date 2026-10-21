import { SITE } from "~/lib/site";

export function BrandWordmark({
	accentClassName = "text-primary",
}: {
	accentClassName?: string;
}) {
	return (
		<>
			{SITE.wordmark.prefix}
			<span className={accentClassName}>{SITE.wordmark.accent}</span>
		</>
	);
}
