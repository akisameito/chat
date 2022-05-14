// 便利なサイト https://bareynol.github.io/mui-theme-creator/
import { ThemeOptions, createTheme } from '@mui/material/styles'
export const themeDefault = (()=>{
    return createTheme();
})();

export const themeA = (() => {
    const themeOptions: ThemeOptions = {
        palette: {
            mode: 'light',
            primary: {
                main: '#D7A5C0',
            },
            secondary: {
                main: '#aae4d5',
            },
            // tertiary: { // src\theme\themeOption.tsでモジュール拡張
            //     main: '#ec407a',
            // },
            background: {
                default: '#F3D1E9',
                paper: '#DCDA91',
            },
        },
        typography: {
            fontFamily: [
                'Roboto',
                '"Noto Sans JP"',
                '"Helvetica"',
                'Arial',
                'sans-serif',
            ].join(','),
        }
    };
    return createTheme(themeOptions);
})();
export const themeB = (() => {
    const themeOptions: ThemeOptions = {
        palette: {
            mode: 'light',
            primary: {
                main: '#605b83',
            },
            secondary: {
                main: '#80C542',
            },
            // tertiary: { // src\theme\themeOption.tsでモジュール拡張
            //     main: '#ec407a',
            // },
            background: {
                paper: 'rgb(241,239,239)',
                default: '#6060A9',
            },
        },
    };
    return createTheme(themeOptions);
})();
