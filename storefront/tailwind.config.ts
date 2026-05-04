import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2d5143', // Dark Olive Green
                    50: '#f4f7f6',
                    100: '#e9efed',
                    200: '#c8d6d2',
                    300: '#a7bdb6',
                    400: '#668b7f',
                    500: '#2d5143',
                    600: '#29493c',
                    700: '#223d32',
                    800: '#1b3128',
                    900: '#162821',
                },
                accent: {
                    DEFAULT: '#a7c655', // Lighter Green/Yellow
                    light: '#bcd47d',
                    dark: '#8eb03a',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
