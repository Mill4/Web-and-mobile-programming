/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { get } from '../api/apiHelper';

function PrivateRoute({ children, ...rest }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthentication = () =>
        get('/api/auth/checkToken', null, true)
            .then(() => {
                setIsAuthenticated(true);
            })
            .catch(() => {
                setIsAuthenticated(false);
            })
            .then(() => setIsLoading(false));

    useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <Route
            {...rest}
            render={({ location }) =>
                !isLoading ? (
                    isAuthenticated ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: location },
                            }}
                        />
                    )
                ) : (
                    <CircularProgress />
                )
            }
        />
    );
}

export default PrivateRoute;
