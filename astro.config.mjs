// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://aoitsukikage-eng.github.io',
	base: '/',
	i18n: {
		defaultLocale: 'zh',
		locales: ['zh', 'en'],
		routing: {
			prefixDefaultLocale: false,
			fallbackType: 'rewrite',
		},
		fallback: {
			en: 'zh',
		},
	},
});
