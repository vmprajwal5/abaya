/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            colors: {
                black: '#000000',
                white: '#FFFFFF',
                primary: '#000000', // Making primary black for luxury feel
                secondary: '#1a1a1a', // Dark gray/almost black for secondary
                gray: {
                    50: '#FAFAFA',
                    100: '#F5F5F5',
                    200: '#E5E5E5',
                    300: '#D4D4D4',
                    400: '#A3A3A3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
            },
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            maxWidth: {
                'container': '1200px',
            },
            letterSpacing: {
                'tighter': '-0.02em',
                'tight': '-0.01em',
                'normal': '0',
                'wide': '0.05em',
                'wider': '0.1em',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}