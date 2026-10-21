/** Shared MDX processing options used by the content macro and runtime source. */
export const CONTENT_DOCS_OPTIONS = {
	docs: {
		postprocess: {
			includeProcessedMarkdown: true,
		},
	},
} as const;
