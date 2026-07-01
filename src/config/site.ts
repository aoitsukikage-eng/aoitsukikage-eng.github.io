export const siteConfig = {
	name: "Aoi Tsukikage Engineering",
	tagline: "System-grade portfolio shell with placeholder-safe content routing.",
	email: "hello@placeholder.invalid",
	socials: {
		github: "https://github.com/placeholder",
		linkedin: "https://www.linkedin.com/in/placeholder/",
	},
} as const;

export type SiteConfig = typeof siteConfig;
