import type { CollectionEntry } from "astro:content";

export type ProjectEntry = CollectionEntry<"projectCases">;

export const TRACK_LABELS = {
	personal_project: "Personal",
	professional_case: "Professional",
	research: "Research",
} as const;

export const STATUS_LABELS = {
	active: "Active",
	ongoing: "Ongoing",
	completed: "Completed",
	archived: "Archived",
} as const;

export const VISIBILITY_LABELS = {
	public: "Public",
	partial: "Partial",
	confidential: "Confidential",
} as const;

export const TRACK_FILTERS = [
	{ value: "all", label: "All" },
	{ value: "personal_project", label: "Personal" },
	{ value: "professional_case", label: "Professional" },
	{ value: "research", label: "Research" },
] as const;

export const STATUS_FILTERS = [
	{ value: "all", label: "All" },
	{ value: "active", label: "Active" },
	{ value: "ongoing", label: "Ongoing" },
	{ value: "completed", label: "Completed" },
	{ value: "archived", label: "Archived" },
] as const;

export const sortProjects = (projects: ProjectEntry[]) =>
	[...projects].sort((left, right) => {
		const leftOrder = left.data.order ?? Number.MAX_SAFE_INTEGER;
		const rightOrder = right.data.order ?? Number.MAX_SAFE_INTEGER;

		if (leftOrder !== rightOrder) {
			return leftOrder - rightOrder;
		}

		return left.data.title.localeCompare(right.data.title);
	});

export const getDomainFilters = (projects: ProjectEntry[]) =>
	Array.from(
		new Set(
			projects.flatMap((project) => project.data.domain.map((item) => item.trim())),
		),
	).sort((left, right) => left.localeCompare(right));

export const isPlaceholderProject = (project: ProjectEntry) =>
	project.data.placeholder === true ||
	project.data.status === "ongoing" ||
	project.data.title.toLowerCase().includes("placeholder");

export const getVisibilityNote = (project: ProjectEntry) => {
	if (project.data.visibility === "confidential") {
		return "Confidential record. Only taxonomy-safe metadata is published.";
	}

	if (project.data.visibility === "partial") {
		return "Partial visibility. Delivery specifics and sensitive context stay withheld.";
	}

	return "Public placeholder. Structure is visible while full portfolio content remains deferred.";
};

export const getTrackLabel = (track: ProjectEntry["data"]["track"]) => TRACK_LABELS[track];

export const getStatusLabel = (status: ProjectEntry["data"]["status"]) =>
	STATUS_LABELS[status];

export const getVisibilityLabel = (
	visibility: ProjectEntry["data"]["visibility"],
) => VISIBILITY_LABELS[visibility];
