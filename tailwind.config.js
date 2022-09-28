/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        '../dev/partials/layouts/**/*.{xml,html,js}',
    ],
    theme: {
        extend: {
            fontFamily: {
                fontPrimary: 'var(--fontPrimary)',
                fontSecondary: 'var(--fontSecondary)',
            },
            backgroundImage: {
                imageBackground: 'var(--imageBackground)',
                imageOrnamentTop: 'var(--imageOrnamentTop)',
                imageOrnamentBottom: 'var(--imageOrnamentBottom)',
                imageOrnamentAltTop: 'var(--imageOrnamentAltTop)',
                imageOrnamentAltBottom: 'var(--imageOrnamentAltBottom)',
            },
            colors: {
                colorMain: 'var(--colorMain)',
                colorText: 'var(--colorText)',
                colorBackground: 'var(--colorBackground)',
            },
        },
    },
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        require('@tailwindcss/line-clamp')
    ],
};
