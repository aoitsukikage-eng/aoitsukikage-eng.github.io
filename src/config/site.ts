export const siteConfig = {
	name: "Aoi Tsukikage Engineering",
	tagline: "Portfolio information architecture v1",
	email: "hello@placeholder.invalid",
	socials: {
		github: "https://github.com/placeholder",
		linkedin: "https://www.linkedin.com/in/placeholder/",
	},
} as const;

export type SiteConfig = typeof siteConfig;
