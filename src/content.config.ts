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
		year: z.number().int().min(1900).max(3000).optional(),
		date: z.coerce.date().optional(),
		tags: z.array(z.string().min(1)).optional(),
	}),
});

export const collections = {
	projectCases: projectCaseCollection,
	researchItems: researchItemCollection,
};
