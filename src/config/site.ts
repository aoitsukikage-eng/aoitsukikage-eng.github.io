export const siteConfig = {
	name: "Aoi Tsukikage Engineering",
	tagline: "Placeholder-safe portfolio shell with calm system framing.",
	email: "hello@placeholder.invalid",
	socials: {
		github: "https://github.com/placeholder",
		linkedin: "https://www.linkedin.com/in/placeholder/",
	},
} as const;

export type SiteConfig = typeof siteConfig;
