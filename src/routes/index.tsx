import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Footer } from "~/components/footer";
import { PageRails } from "~/components/frame";
import { ProductsExplorer } from "~/components/products/products-explorer";
import { baseOptions } from "~/lib/layout.shared";
import { createPageMeta } from "~/lib/meta";
import { ROUTES, SITE } from "~/lib/site";
import type { Route } from "./+types/index";

export const meta: Route.MetaFunction = () =>
	createPageMeta({
		title: SITE.title,
		description: SITE.description,
		path: ROUTES.home,
	});

/**
 * `/` — the 0xBUFF products page, carried into the docs site: PageHero with
 * the filter bar, then the catalogue frame, straight into the footer.
 */
export default function ProductsIndex() {
	return (
		<HomeLayout {...baseOptions()}>
			<main className="flex-1">
				<PageRails />
				<ProductsExplorer />
			</main>
			<Footer />
		</HomeLayout>
	);
}
