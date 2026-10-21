import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Link } from "react-router";
import { Crosshair, FrameCrosshairs } from "./crosshair";
import { Footer } from "./footer";
import { baseOptions } from "~/lib/layout.shared";
import { ROUTES } from "~/lib/site";

export function NotFoundPage() {
	return (
		<HomeLayout {...baseOptions()}>
			<div className="relative w-full bg-background text-foreground">
				<section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
					<div className="relative mx-auto w-full max-w-5xl">
						{[
							"-left-6 -right-6 top-0 origin-center animate-line-x border-t sm:-left-10 sm:-right-10",
							"-left-6 -right-6 bottom-0 origin-center animate-line-x border-b sm:-left-10 sm:-right-10",
							"-top-6 -bottom-6 left-0 origin-top animate-line-y border-l sm:-top-8 sm:-bottom-8",
							"-top-6 -bottom-6 right-0 origin-top animate-line-y border-r sm:-top-8 sm:-bottom-8",
						].map((position) => (
							<div
								key={position}
								className={cn(
									"pointer-events-none absolute border-dashed border-border/70",
									position,
								)}
							/>
						))}
						{/* One crosshair at the center of each edge of the hero frame */}
						<FrameCrosshairs />

						<div
							className={cn(
								"relative flex items-center justify-between border-x border-t",
								"border-dashed border-border px-4 py-2 font-mono text-xs",
								"text-muted-foreground backdrop-blur-xs sm:px-6",
							)}
						>
							<span className="font-semibold text-foreground">
								~ <code>404</code>
							</span>
							<span className="hidden text-[10px] tracking-widest uppercase sm:inline">
								error / not_found
							</span>
						</div>

						<div className="relative border border-dashed border-border">
							<div className="relative px-4 py-8 text-center sm:px-8 sm:py-10">
								<div className="flex items-center justify-center gap-2">
									<span aria-hidden className="size-1.5 bg-warning" />
									<span className="font-mono text-warning text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
										404 — Not Found
									</span>
								</div>
								<h1 className="mx-auto mt-3 max-w-3xl text-balance text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl">
									Page not found
								</h1>
							</div>

							<div className="relative border-t border-dashed border-border">
								<div className="pointer-events-none absolute inset-x-0 top-0 origin-left animate-line-x border-t border-dashed border-border" />
								<Crosshair className="hidden md:block" side="left" />
								<Crosshair className="hidden md:block" side="right" />
							</div>

							<div className="px-4 py-6 text-center sm:px-8 sm:py-7">
								<p className="mx-auto max-w-2xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
									The page you’re looking for doesn’t exist. It may have been
									moved, renamed, or never existed in this memory plane.
								</p>
								<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
									<Button asChild size="lg" className="font-bold tracking-wide">
										<Link to={ROUTES.home}>Back to Home</Link>
									</Button>
									<Button
										asChild
										variant="secondary"
										size="lg"
										className="font-bold tracking-wide"
									>
										<Link to={ROUTES.docs}>Browse Documentation</Link>
									</Button>
								</div>
							</div>
						</div>

						<div
							className={cn(
								"relative flex items-center justify-between border-x border-b",
								"border-dashed border-border px-4 py-2 font-mono text-[10px]",
								"text-muted-foreground/70 backdrop-blur-xs sm:px-6",
							)}
						>
							<span>[status: 404]</span>
							<span>[ref: not_found]</span>
						</div>
					</div>
				</section>
				<Footer />
			</div>
		</HomeLayout>
	);
}
