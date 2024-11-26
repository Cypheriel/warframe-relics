import aspectRatio from '@tailwindcss/aspect-ratio';
import daisyui from 'daisyui';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [
		aspectRatio,
		daisyui,
	],

	// daisyUI Themes
	daisyui: {
		themes: [
			{
				dark: {
					'primary': '#a5b4fc',
					'secondary': '#7dd3fc',
					'accent': '#f3e8ff',
					'neutral': '#4b5563',
					'base-100': '#111111',
					'base-content': '#f1f1f1',
					'info': '#a5f3fc',
					'success': '#d9f99d',
					'warning': '#fef08a',
					'error': '#fca5a5',
				}
			}
		]
	}
} satisfies Config;
