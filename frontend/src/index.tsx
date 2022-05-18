import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'Router';
// style
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { themeDefault, themeA, themeB } from './theme/themes';

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={themeA}>
            <CssBaseline />
            <Router />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);