import type { CollectionEntry } from "astro:content";

export type ResearchEntry = CollectionEntry<"researchItems">;

export const RESEARCH_GROUPS = [
	{
		key: "quantitative",
		label: "量化研究",
		description:
			"以報酬、風險、Beta 與投資組合模型整理資料、比較假設與限制。",
		types: ["quantitative"],
	},
	{
		key: "comparative",
		label: "比較研究",
		description:
			"以跨公司與跨文件閱讀，辨識揭露內容、指標與比較邊界。",
		types: ["comparative"],
	},
	{
		key: "narrative",
		label: "論述與案例研究",
		description:
			"以時間脈絡、法規框架與社區情境組織公開資料與案例觀察。",
		types: ["narrative"],
	},
] as const;

export type ResearchGroupKey = (typeof RESEARCH_GROUPS)[number]["key"];

export const getResearchEntries = (entries: ResearchEntry[]) =>
	entries.filter((entry) => entry.data.track === "research");

export const getResearchGroup = (entry: ResearchEntry): ResearchGroupKey => entry.data.type;

export const sortResearch = (entries: ResearchEntry[]) =>
	[...entries].sort((left, right) => right.data.year - left.data.year || left.data.title.localeCompare(right.data.title));

export const getResearchDomainFilters = (entries: ResearchEntry[]) =>
	Array.from(new Set(entries.flatMap((entry) => entry.data.domain))).sort((left, right) =>
		left.localeCompare(right),
	);
