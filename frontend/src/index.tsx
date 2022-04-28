import React from 'react';
import ReactDOM from 'react-dom';
import 'index.css';
import Router from 'Router';
import { CookiesProvider } from "react-cookie";

ReactDOM.render(
    <React.StrictMode>
        <CookiesProvider>
            <Router />
        </CookiesProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

