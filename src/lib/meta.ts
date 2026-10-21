/** Shared Open Graph, Twitter, and canonical metadata construction for pages. */

import type { MetaDescriptor } from "react-router";
import { ROUTES, SITE, toSiteUrl } from "./site";

/** Input used to create consistent metadata for a public page. */
interface PageMetaInput {
	title: string;
	description: string;
	path: string;
	imagePath?: string;
}

/** Creates the standard metadata shared by all public pages. */
export function createPageMeta({
	title,
	description,
	path,
	imagePath = SITE.defaultImagePath,
}: PageMetaInput): MetaDescriptor[] {
	const canonicalUrl = toSiteUrl(path);
	const imageUrl = toSiteUrl(imagePath);
	const pageTitle = title === SITE.name ? title : `${title} | ${SITE.name}`;
	const imageAlt =
		imagePath === SITE.defaultImagePath
			? SITE.defaultImageAlt
			: `${title} — ${SITE.name}`;
	const isGeneratedDocImage = imagePath.startsWith(`${ROUTES.docsOg}/`);
	const imageType = imagePath.endsWith(".webp") ? "image/webp" : "image/png";
	const imageWidth = isGeneratedDocImage ? "1200" : "512";
	const imageHeight = isGeneratedDocImage ? "630" : "512";

	return [
		{ title: pageTitle },
		{ name: "description", content: description },
		{ property: "og:title", content: pageTitle },
		{ property: "og:description", content: description },
		{ property: "og:url", content: canonicalUrl },
		{ property: "og:image", content: imageUrl },
		{ property: "og:image:type", content: imageType },
		{ property: "og:image:width", content: imageWidth },
		{ property: "og:image:height", content: imageHeight },
		{ property: "og:image:alt", content: imageAlt },
		{ property: "og:site_name", content: SITE.name },
		{ property: "og:type", content: "website" },
		{ property: "og:locale", content: SITE.locale },
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:site", content: SITE.xHandle },
		{ name: "twitter:creator", content: SITE.xHandle },
		{ name: "twitter:title", content: pageTitle },
		{ name: "twitter:description", content: description },
		{ name: "twitter:image", content: imageUrl },
		{ name: "twitter:image:alt", content: imageAlt },
		{ tagName: "link", rel: "canonical", href: canonicalUrl },
	];
}
