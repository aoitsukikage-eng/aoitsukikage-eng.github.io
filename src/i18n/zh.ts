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
	researchIndex: {
		kicker: string;
		heading: string;
		lede: string;
		briefsUnit: string;
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
	researchIndex: {
		kicker: "[RESEARCH HUB]",
		heading: "五份研究，依各自方法能回答的問題整理。",
		lede: "公開頁面保留研究問題、方法、發現與限制；原始檔案、學生資訊與未授權第三方素材不公開。",
		briefsUnit: "BRIEFS",
	},
};

export type Translation = Dictionary;
export default zh;
