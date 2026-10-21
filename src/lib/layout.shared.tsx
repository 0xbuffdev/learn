import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { PRIMARY_NAVIGATION, ROUTES, SITE } from "./site";
import { BrandWordmark } from "~/components/brand-wordmark";

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			url: ROUTES.home,
			transparentMode: "top",
			title: (
				<span className="font-display font-bold tracking-tight">
					tools / <BrandWordmark />
				</span>
			),
		},
		links: [...PRIMARY_NAVIGATION],
		githubUrl: SITE.githubUrl,
	};
}
