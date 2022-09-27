/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/*.{xml,html,js}', './src/partials/*/*.{xml,html,js}', './src/partials/*/*/*.{xml,html,js}', './src/assets/scripts/**/*.{xml,html,js}'],
    theme: {
        extend: {
            fontFamily: {
                fontPrimary: 'var(--fontPrimary)',
                fontSecondary: 'var(--fontSecondary)',

                accent: 'var(--font-accent)',
                latin: 'var(--font-latin)',
            },
            backgroundImage: {
                'imageBackground': "var(--imageBackground)",
                'imageOrnamentTop': "var(--imageOrnamentTop)",
                'imageOrnamentBottom': "var(--imageOrnamentBottom)",
                'imageOrnamentAltTop': "var(--imageOrnamentAltTop)",
                'imageOrnamentAltBottom': "var(--imageOrnamentAltBottom)",
            },
            colors: {
                colorMain: 'var(--colorMain)',
                colorText: 'var(--colorText)',
                colorBackground: 'var(--colorBackground)',



                mainBackground: 'var(--mainBackground)',
                mainPrimary: 'var(--mainPrimary)',
                mainSecondary: 'var(--mainSecondary)',
                mainBorder: 'var(--mainBorder)',

                accent: 'var(--inv-accent)',
                btnColor: 'var(--btn-color)',
                invBorder: 'var(--inv-border)',
                invBg: 'var(--inv-bg)',
                menuBg: 'var(--menu-bg)',
                menuInactive: 'var(--menu-inactive)',
                invBase: 'var(--inv-base)',
            },
        },
    },
    plugins: [require('tailwindcss'), require('autoprefixer'), require('@tailwindcss/line-clamp')],
};
