/**
 * The product catalogue — the single source of truth for every product the
 * docs site lists.
 *
 * The index grid, footer columns, product pages, and product navigation all
 * read this catalogue. Product documentation has its own MDX frontmatter and
 * navigation metadata under `content/docs`.
 *
 * The vocabulary mirrors the 0xBUFF marketing site (`apps/0xbuff/src/lib/
 * products.ts`): every product is a *process* with a pid, a status and a
 * division, and the pids are assigned in catalogue order so the grid reads
 * left-to-right as one sequence.
 */
import { ROUTES } from "./site";

export type Division = "tools" | "education";

/**
 * Process status — the dot and the word beside it on a card or a product page.
 *
 * `running` is the healthy state, `beta`/`alpha` are early but usable, and
 * `spawning` means the product is announced but not yet open.
 */
export type ProcessStatus = "running" | "beta" | "alpha" | "spawning";

/** One fact in a product page's facts row (lifecycle, language, licence …). */
export type ProductFact = { label: string; value: string };

/** One capability of a product — a section on its product page. */
export type ProductFeature = {
	title: string;
	description: string;
};

/**
 * One "in practice" example on a product page — a short use case, not a
 * capability: the feature says what the product does, the example says who
 * points it at what. Copy here is illustrative until product owners replace
 * it, so it stays concrete but makes no hard promises.
 */
export type ProductExample = {
	title: string;
	description: string;
	/** A mono context line above the title (`cursor · codex`, `cargo · ci`). */
	meta?: string;
};

/** Commands shown in a product's install bar. */
export type ProductInstall = {
	/** The direct command for a person installing the product. */
	human: string;
	/** The agent-skill setup command; shown only when the product has a skill. */
	agent?: string;
};

export type Product = {
	slug: string;
	/** The process id shown on cards and product pages (`0x01`, `0x02`, …). */
	pid: string;
	name: string;
	kind: string;
	division: Division;
	/** One line — the card's short description and the product page's kicker. */
	tagline: string;
	status: ProcessStatus;
	/** Whether this product offers an agent skill and therefore audience tabs. */
	hasSkill: boolean;
	/** The product page's statement band: a heading and its supporting prose. */
	statement?: { heading: string; body: string };
	url?: string;
	docsUrl?: string;
	repository?: string;
	install?: ProductInstall;
	/** The facts row — lifecycle, language, platform, licence. */
	facts?: ProductFact[];
	features?:any

};

export const products: Product[] = [
	{
		slug: "memofs",
		pid: "0x01",
		name: "MemoFS",
		kind: "File-first memory for AI agents",
		division: "tools",
		tagline: "A memory your agent can read, edit, and carry between sessions.",
		status: "running",
		hasSkill: true,
		statement: {
			heading: "Memory is a directory.",
			body: "MemoFS stores what an agent knows as Markdown and JSONL inside the project it works on. Facts, decisions, and recall indexes are ordinary files — the agent reads them, writes them, and git tracks every change. Nothing is locked in a database you cannot open.",
		},
		docsUrl: ROUTES.introduction,
		repository: "https://github.com/0xbuffdev/memofs",
		install: {
			human: "npm install -D @memofs/cli",
			agent: "npx --yes -p @memofs/cli memofs generate agent codex",
		},
		facts: [
			{ label: "Release", value: "Beta" },
			{ label: "Language", value: "TypeScript" },
			{ label: "Platform", value: "Node 20+ / Workers" },
			{ label: "License", value: "MIT" },
		],
		features: [
			{
				title: "Memory you can inspect",
				description:
					"Facts, decisions, and recall indexes live as Markdown and JSONL in your project. Open them in any editor, diff them in git, and the agent's memory is reviewable like code.",
			},
			{
				title: "Local by default",
				description:
					"No database, no account, no API key. The runtime resolves its configuration from constructor options, then environment variables, then `.memofs/config.json` — and starts in local mode.",
			},
			{
				title: "Works with your agent",
				description:
					"Connect over MCP, embed the SDK, or call the CLI. The same store sits behind all three, so memory outlives the tool that wrote it."
			}
		],
	},
	{
		slug: "buildtrace",
		pid: "0x02",
		name: "BuildTrace",
		kind: "Supply-chain security",
		division: "tools",
		tagline: "Inventory build scripts and procedural macros before they run.",
		status: "alpha",
		hasSkill: false,
		statement: {
			heading: "A build is a program too.",
			body: "Build scripts and procedural macros run with the same privileges as your compiler. BuildTrace inventories that code today; its planned recorder will make file, process, and network activity reviewable as dependencies change.",
		},
		docsUrl: `${ROUTES.docs}/buildtrace`,
		repository: "https://github.com/christophersesugh/buildtrace",
		install: {
			human:
				"git clone https://github.com/christophersesugh/buildtrace && cd buildtrace && cargo run -p buildtrace-cli -- inventory",
		},
		facts: [
			{ label: "Release", value: "Pre-alpha" },
			{ label: "Language", value: "Rust" },
			{ label: "Platform", value: "Linux" },
			{ label: "License", value: "MIT or Apache-2.0" },
		],
		features: [
			{
				title: "Observe the build",
				description:
					"List every build script and procedural macro in the dependency graph without executing any of them, so you can see how much build-time code your project pulls in.",
			},
			{
				title: "Record build behavior ",
				description:
					"The planned recorder will run Cargo as a child process and observe file, process, and network operations. Recording is still in development.",
			},
			{
				title: "Compare policy changes (planned)",
				description:
					"The planned workflow will compare recorded behavior against a reviewed policy in CI. Recording, policy proposals, and policy comparison are not implemented yet.",
			},
		],
	},
	{
		slug: "0xnand",
		pid: "0x03",
		name: "0xNAND",
		kind: "Make hard systems actually make sense.",
		division: "education",
		tagline: "Build a computer from logic gates to a working operating system, one project at a time.",
		status: "running",
		hasSkill: false,
		url: "https://0xnand.com"
	},
];

export function getProduct(slug: string): Product | undefined {
	return products.find((product) => product.slug === slug);
}

/** Resolves the docs slug used for a product's detail-page metadata. */
export function productDocsSlug(product: Product): string | undefined {
	const docsPrefix = `${ROUTES.docs}/`;
	if (!product.docsUrl?.startsWith(docsPrefix)) return undefined;
	return product.docsUrl.slice(docsPrefix.length);
}

/** Canonical path for a product overview on this site. */
export function productDetailsPath(slug: string): string {
	return `${ROUTES.products}/${slug}`;
}

/** Every product that has its own page — the product route's valid slug list. */
export function productsWithDetails(): Product[] {
	return products.filter((product) => product.features && !product.url);
}

export type ProductLink = { href: string; external: boolean; label: string };

/**
 * Where a product's card points, and what that destination is called.
 *
 * Three cases, and no call site may re-derive any of them:
 *
 * - a product with its own website       → that website, in a new tab;
 * - a product with a page on this site   → that page, read in place;
 * - a product whose docs live elsewhere  → that docs site, in a new tab.
 *
 * `external` decides `<a target="_blank">` vs a router `<Link>`, and it is
 * returned rather than recomputed so a card and the footer can never disagree.
 */
export function productLink(product: Product): ProductLink {
	if (product.url) {
		return {
			href: product.url,
			external: true,
			label: `Visit ${product.name}`,
		};
	}
	if (product.features) {
		return {
			href: productDetailsPath(product.slug),
			external: false,
			label: "See the overview",
		};
	}
	if (product.docsUrl) {
		return {
			href: product.docsUrl,
			external: product.docsUrl.startsWith("http"),
			label: "Read the docs",
		};
	}
	return { href: "/", external: false, label: "Visit the home page" };
}

/**
 * The text shown on a card's destination line.
 *
 * A product on this site shows its path; one that lives elsewhere shows the
 * host it lives on.
 */
export function productDestination(product: Product): string {
	const link = productLink(product);
	if (!link.external) return link.href;
	try {
		return new URL(link.href).hostname;
	} catch {
		return link.href;
	}
}
