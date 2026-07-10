export const siteConfig = {
	name: "Yuhung Shih",
	tagline: "NTPU Finance Student | Quantitative Finance | Python Automation | FinTech",
	email: "aoitsukikage@gmail.com",
	avatar: "/profile/yuhung-shih-avatar.jpg",
	socials: {
		github: "https://github.com/aoitsukikage-eng",
		linkedin: "https://www.linkedin.com/in/yuhungshih",
	},
} as const;

export type SiteConfig = typeof siteConfig;
