/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				white: '#FFFFFF',
				black: '#09090B',
				green: {
					light: '#F2FFCC',
					DEFAULT: '#DFFF80',
					dark: ' #245D54'
				},
				red: {
					light: '#FFF0F0',
					DEFAULT: '#FBA7B1',
					dark: '#AE0F0F'
				},
				blue: {
					light: '#EBFCFE',
					DEFAULT: '#91ECFA',
					dark: '#0C588B'
				},
				pink: {
					light: '#FEF0FC',
					DEFAULT: '#FBA2EF',
					dark: '#8B0C6D'
				},
				purple: {
					light: '#EBE2FF',
					DEFAULT: '#AFA1FF',
					dark: '#4A04A5'
				},
				eggshell: {
					light: '#FFF3EB',
					DEFAULT: '#FFB885',
					dark: '#AB3812'
				},
				gray: {
					lightest: '#FAFAFA',
					lighter: '#F4F4F5',
					light: '#E4E4E7',
					DEFAULT: '#71717A',
					dark: '#18181B'
				}
			}
		}
	},
	plugins: []
};
