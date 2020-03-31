import React from 'react';

import { Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Register from './components/Register';
import StockExchanges from './components/StockExchanges';
import history from './components/history';

function App() {
    return (
        <Router history={history}>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
                <PrivateRoute path="/">
                    <StockExchanges />
                </PrivateRoute>
            </Switch>
        </Router>
    );
}

export default App;
