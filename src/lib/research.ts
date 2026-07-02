import type { CollectionEntry } from "astro:content";

export type ResearchEntry = CollectionEntry<"projectCases">;

export const RESEARCH_GROUPS = [
	{
		key: "quantitative",
		label: "Quantitative Research",
		description:
			"Domain tags such as quantitative and finance keep numerical or model-led research grouped together.",
		tags: ["quantitative", "finance"],
	},
	{
		key: "discourse",
		label: "Discourse Research",
		description:
			"Domain tags such as academic-writing and regulation keep writing-led or policy-led research grouped together.",
		tags: ["academic-writing", "regulation"],
	},
] as const;

export type ResearchGroupKey = (typeof RESEARCH_GROUPS)[number]["key"];

export const getResearchEntries = (entries: ResearchEntry[]) =>
	entries.filter((entry) => entry.data.track === "research");

export const getResearchGroup = (entry: ResearchEntry): ResearchGroupKey => {
	const domains = new Set(entry.data.domain);

	if (RESEARCH_GROUPS[0].tags.some((tag) => domains.has(tag))) {
		return "quantitative";
	}

	return "discourse";
};

export const getResearchDomainFilters = (entries: ResearchEntry[]) =>
	Array.from(new Set(entries.flatMap((entry) => entry.data.domain))).sort((left, right) =>
		left.localeCompare(right),
	);
