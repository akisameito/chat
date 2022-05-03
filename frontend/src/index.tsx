import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'Router';
import { CookiesProvider } from "react-cookie";
// style
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { themeA, themeB } from './theme/themes';

ReactDOM.render(
    <React.StrictMode>
        <CookiesProvider>
            <ThemeProvider theme={themeB}>
                <CssBaseline />
                <Router />
            </ThemeProvider>
        </CookiesProvider>
    </React.StrictMode>,
    document.getElementById('root')
);