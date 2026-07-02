import type { CollectionEntry } from "astro:content";

export type ActivityEntry = CollectionEntry<"activities">;

export const ACTIVITY_TYPE_LABELS = {
	volunteer: "Volunteer",
	talk: "Talk",
	visit: "Visit",
	forum: "Forum",
	community: "Community",
} as const;

export const sortActivities = (activities: ActivityEntry[]) =>
	[...activities].sort(
		(left, right) => right.data.date.getTime() - left.data.date.getTime(),
	);

export const getActivityTypeLabel = (
	type: ActivityEntry["data"]["type"],
) => ACTIVITY_TYPE_LABELS[type];

export const getActivityTypeFilters = (activities: ActivityEntry[]) =>
	Array.from(new Set(activities.map((activity) => activity.data.type))).map((type) => ({
		value: type,
		label: getActivityTypeLabel(type),
	}));

export const getActivityTagFilters = (activities: ActivityEntry[]) =>
	Array.from(
		new Set(
			activities.flatMap((activity) =>
				activity.data.tags.map((tag) => tag.trim()),
			),
		),
	).sort((left, right) => left.localeCompare(right));

export const formatActivityDate = (date: Date) =>
	new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);

export const formatPlaceholderLabel = (value: string) =>
	value
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");

export const getActivityPhotoCaption = (
	activity: ActivityEntry,
	photo: string,
	index: number,
) =>
	`Placeholder caption ${index + 1} for ${activity.data.title}: ${formatPlaceholderLabel(photo)} reserved for a future public-safe photo swap.`;
