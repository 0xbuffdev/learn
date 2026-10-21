import { HomeLayout } from "fumadocs-ui/layouts/home";
import type * as React from "react";
import { Link } from "react-router";
import { Footer } from "~/components/footer";
import { PageRails, RuledSection } from "~/components/frame";
import {
	ProductFeatures,
	ProductFactsheet,
	ProductHero,
} from "~/components/products/product-sections";
import { baseOptions } from "~/lib/layout.shared";
import { createPageMeta } from "~/lib/meta";
import {
	getProduct,
	productDetailsPath,
	productDocsSlug,
} from "~/lib/products";
import { resolveDocPage } from "~/lib/source";
import { ROUTES, SITE } from "~/lib/site";
import type { Route } from "./+types/$slug";

export function loader({ params }: Route.LoaderArgs) {
	const product = getProduct(params.slug);
	if (!product?.features || product.url)
		throw new Response("Product not found", { status: 404 });
	const docsSlug = productDocsSlug(product);
	if (!docsSlug) throw new Response("Product documentation not found", { status: 404 });
	const { page } = resolveDocPage(docsSlug);
	return {
		product,
		title: page.data.title,
		description: page.data.description ?? SITE.description,
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	if (!loaderData) return [{ title: `Product not found | ${SITE.name}` }];
	return createPageMeta({
		title: loaderData.title,
		description: loaderData.description,
		path: productDetailsPath(loaderData.product.slug),
	});
}

/**
 * The product page: a breadcrumb band, then the hero band (identity, kind,
 * the decoding title, the description, the actions and one slim install bar),
 * the features band (illustrated capability cards, rail to rail), and the
 * factsheet band (the spec rows). No band between hero and features carries a
 * headline — the name, the description and then the features is the whole
 * pitch. The footer sits directly on the factsheet band's rule, so it draws
 * none of its own.
 */
export default function ProductPage({
	loaderData,
}: Route.ComponentProps) {
	const { product, description } = loaderData;

	return (
		<HomeLayout {...baseOptions()}>
			<main className="flex-1">
				<PageRails />

				{/* Breadcrumb band */}
				<RuledSection contentClassName="py-3 sm:py-4">
					<nav
						aria-label="Breadcrumb"
						className="flex items-center font-mono text-muted-foreground text-xs"
					>
						<ol className="flex items-center gap-2">
							<li>
								<Link className="hover:text-foreground" to={ROUTES.home}>
									Products
								</Link>
							</li>
							<li aria-hidden="true">/</li>
							<li aria-current="page" className="text-foreground">
								{product.name}
							</li>
						</ol>
					</nav>
				</RuledSection>

				<ProductHero description={description} product={product} />
				<ProductFeatures product={product} />
				<ProductFactsheet product={product} />
			</main>
			<Footer hasPrecedingRule />
		</HomeLayout>
	);
}
