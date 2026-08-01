import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro:schema";

const trackEnum = z.enum([
	"personal_project",
	"professional_case",
	"research",
]);

const statusEnum = z.enum([
	"active",
	"ongoing",
	"completed",
	"archived",
]);

const visibilityEnum = z.enum([
	"public",
	"partial",
	"confidential",
]);

const activityTypeEnum = z.enum([
	"volunteer",
	"talk",
	"visit",
	"forum",
	"community",
]);

const projectCaseCollection = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: "./src/content/projectCases",
	}),
	schema: z.object({
		title: z.string().min(1),
		slug: z.string().min(1),
		summary: z.string().min(1),
		track: trackEnum,
		domain: z.array(z.string().min(1)).min(1),
		status: statusEnum,
		visibility: visibilityEnum,
		placeholder: z.boolean().optional(),
		teamRole: z.string().min(1).optional(),
		background: z.string().min(1).optional(),
		disclosure: z.string().min(1).optional(),
		showDisclosureLayer: z.boolean().optional(),
		links: z
			.object({
				repo: z.string().url().optional(),
				demo: z.string().url().optional(),
			})
			.optional(),
		order: z.number().int().optional(),
		featured: z.boolean().optional(),
	}),
});

const researchItemCollection = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: "./src/content/researchItems",
	}),
		schema: z.object({
		title: z.string().min(1),
		slug: z.string().min(1),
		summary: z.string().min(1),
		track: z.literal("research"),
		domain: z.array(z.string().min(1)).min(1),
		status: statusEnum,
		visibility: visibilityEnum,
		year: z.number().int().min(1900).max(3000),
		tags: z.array(z.string().min(1)).min(1),
		type: z.enum(["quantitative", "comparative", "narrative"]),
		highlights: z
			.array(
				z.object({
					label: z.string().min(1),
					value: z.string().min(1),
					detail: z.string().min(1).optional(),
				}),
			)
			.min(1),
		methods: z.array(z.string().min(1)).min(1),
		findings: z.array(z.string().min(1)).min(1),
		reflection: z.string().min(1),
		visuals: z
			.array(
				z.object({
					kind: z.enum(["chart", "framework"]),
					src: z.string().startsWith("/"),
					alt: z.string().min(1),
					caption: z.string().min(1),
				}),
			)
			.optional(),
	}),
});

const activitiesCollection = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: "./src/content/activities",
	}),
	schema: z.object({
		title: z.string().min(1),
		org: z.string().min(1),
		date: z.coerce.date(),
		type: activityTypeEnum,
		role: z.string().min(1),
		summary: z.string().min(1),
		photos: z.array(z.string().min(1)),
		tags: z.array(z.string().min(1)),
	}),
});

export const collections = {
	projectCases: projectCaseCollection,
	researchItems: researchItemCollection,
	activities: activitiesCollection,
};
