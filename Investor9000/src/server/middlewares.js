/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const config = require('./config/config');

const withAuth = (req, res, next) => {
    const authHeader = req.cookies.jwtToken;

    if (authHeader) {
        jwt.verify(authHeader, config.jwtTokenSecret, (error, user) => {
            if (error) {
                const err = new Error('JWT ei validi');
                err.status = 401;
                next(err);
            }
            req.user = user;
            next();
        });
    } else {
        const err = new Error('JWT puuttuu');
        err.status = 401;
        next(err);
    }
};

module.exports = { withAuth };
