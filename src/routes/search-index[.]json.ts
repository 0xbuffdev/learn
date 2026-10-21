import { createFromSource } from "fumadocs-core/search/server";
import { source } from "../lib/source";

/**
 * Build-time search index for static hosting. Prerendered to
 * `/search-index.json` once per deploy; the docs search dialog downloads it
 * (`staticClient`) instead of querying a server that does not exist on
 * Cloudflare Pages. It covers the documentation collection.
 */
const server = createFromSource(source);

export async function loader() {
	return server.staticGET();
}
