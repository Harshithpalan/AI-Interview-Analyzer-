/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#171717',
                surface: {
                    light: '#262626',
                    DEFAULT: '#1f1f1f',
                    dark: '#121212',
                },
                primary: {
                    light: '#ff7a5c',
                    DEFAULT: '#f2572b',
                    hover: '#d94c26',
                },
                secondary: {
                    light: '#fb7185',
                    DEFAULT: '#f43f5e',
                    hover: '#e11d48',
                },
                accent: {
                    light: '#34d399',
                    DEFAULT: '#10b981',
                    hover: '#059669',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
                'glow-orange': 'glow-orange 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'glow-orange': {
                    '0%': { boxShadow: '0 0 5px rgba(242, 87, 43, 0.2), 0 0 10px rgba(242, 87, 43, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(242, 87, 43, 0.6), 0 0 40px rgba(242, 87, 43, 0.4)' },
                }
            },
        },
    },
    plugins: [],
}
