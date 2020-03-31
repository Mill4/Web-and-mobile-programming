import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';
import App from './App';

ReactDOM.render(
    <SnackbarProvider
        maxSnack={5}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
    >
        <App />
    </SnackbarProvider>,
    document.getElementById('root'),
);
