export interface Dictionary {
	nav: {
		home: string;
		research: string;
		projects: string;
		activities: string;
		about: string;
	};
	langSwitch: {
		label: string;
		targetLocale: string;
	};
}

export const zh: Dictionary = {
	nav: {
		home: "Home",
		research: "Research",
		projects: "Projects",
		activities: "Activities",
		about: "About & Contact",
	},
	langSwitch: {
		label: "EN",
		targetLocale: "en",
	},
};

export type Translation = Dictionary;
export default zh;
