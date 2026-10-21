import { ROUTES } from "./site";

export const docsImageRoute = ROUTES.docsOg;

export function getPageImagePath(slugs: string[], locale?: string) {
	return (
		"/" +
		[locale, ...docsImageRoute.split("/"), ...slugs, "image.webp"]
			.filter(Boolean)
			.join("/")
	);
}
