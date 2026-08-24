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
	contentFallback: {
		notice: string;
		viewLink: string;
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
	contentFallback: {
		notice: "此篇目前僅提供{lang}版。",
		viewLink: "查看{lang}版 →",
	},
};

export type Translation = Dictionary;
export default zh;
