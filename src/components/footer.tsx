import { cn } from "~/lib/utils";
import { Link } from "react-router";
import { PAGE_COLUMN, RULED_BAND_TOP } from "~/components/frame";
import {
	type Division,
	productLink,
	products,
} from "~/lib/products";
import { COMPANY_LINKS, LEGAL_LINKS, ROUTES, SITE } from "~/lib/site";
import { BrandWordmark } from "~/components/brand-wordmark";

/**
 * The footer, carried over from the 0xBUFF marketing site: mono link columns
 * in the page column, an oversized wordmark against the dotted backdrop, and a
 * ruled meta band at the very bottom.
 *
 * The two product columns are derived from `products` through the same
 * `productLink()` the catalogue cards use, so the footer cannot send someone
 * to a different place than the card for the same product.
 * Every destination in this list is a real page — there is no `#` filler.
 */
type FooterLink = { label: string; href: string; external?: boolean };

const productLinks = (division: Division): FooterLink[] =>
	products
		.filter((product) => product.division === division)
		.map((product) => {
			const link = productLink(product);
			return { href: link.href, external: link.external, label: product.name };
		});

const COLUMNS: { title: string; links: FooterLink[] }[] = [
	{ title: "TOOLS", links: productLinks("tools") },
	{
		title: "0xBUFF",
		links: [
			{ label: "products", href: ROUTES.home },
			{ label: "notes", href: COMPANY_LINKS.notes, external: true },
			{
				label: "changelog",
				href: COMPANY_LINKS.changelog,
				external: true,
			},
		],
	},
	{
		title: "LEGAL",
		links: [
			{ label: "Privacy Policy", href: LEGAL_LINKS.privacy, external: true },
			{ label: "Terms of Service", href: LEGAL_LINKS.terms, external: true },
		],
	},
	{
		title: "SOCIAL",
		links: [
			{ label: "X", href: SITE.xUrl, external: true },
			{ label: "github", href: SITE.githubUrl, external: true },
		],
	},
	{ title: "EDUCATION", links: productLinks("education") },
];

const productLinkClassName =
	"font-mono text-muted-foreground text-sm transition-colors hover:text-foreground";

export function Footer({
	hasPrecedingRule = false,
}: {
	/**
	 * True when the element above the footer already ends in a full-bleed
	 * ruled band (e.g. a navigate band), so the footer should not draw a
	 * second rule along the same seam.
	 */
	hasPrecedingRule?: boolean;
}) {
	return (
		// `overflow-hidden` (which contains the oversized wordmark) lives on an inner
		// wrapper, not on the band: on the band it would clip the half of the
		// intersection marker that sits above the footer's top rule.
		<footer className={hasPrecedingRule ? undefined : RULED_BAND_TOP}>
			<div className="overflow-hidden">
				<div className={cn("mx-auto px-4 pt-20 md:px-8", PAGE_COLUMN)}>
					<div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-5">
						{COLUMNS.map((column) => (
							<nav aria-label={column.title} key={column.title}>
								<p className="font-mono text-primary text-xs">{column.title}</p>
								<ul className="mt-4 space-y-2.5">
									{column.links.map((link) => (
										<li key={link.label}>
											{link.external ? (
												<a
													className={productLinkClassName}
													href={link.href}
													rel="noopener noreferrer"
													target="_blank"
												>
													{link.label}
													<span
														aria-hidden="true"
														className="text-muted-foreground/40"
													>
														{" ↗"}
													</span>
												</a>
											) : (
												<Link className={productLinkClassName} to={link.href}>
													{link.label}
												</Link>
											)}
										</li>
									))}
								</ul>
							</nav>
						))}
					</div>
				</div>

				{/* Oversized wordmark. `aria-hidden` because the real brand name
				    is already in the header's link label. */}
				<p
					aria-hidden="true"
					className="mt-16 select-none text-center font-bold font-display text-[19vw] text-foreground/[0.05] leading-[0.8] tracking-tighter xl:text-[15rem]"
				>
					<BrandWordmark accentClassName="text-primary/20" />
				</p>
			</div>

			<div className={RULED_BAND_TOP}>
				<div
					className={cn(
						"mx-auto flex flex-col justify-between gap-2 px-4 py-5 font-mono text-muted-foreground text-xs md:flex-row md:px-8",
						PAGE_COLUMN,
					)}
				>
					<span>© 2026 0xBUFF. All processes reserved.</span>
					<span>
						<a
							className="hover:text-foreground"
							href={`mailto:${SITE.forkEmail}`}
						>
							{SITE.forkEmail}
						</a>
						{" · "}
						<span className="text-primary">EOF</span> · process exited with code
						0
					</span>
				</div>
			</div>
		</footer>
	);
}
