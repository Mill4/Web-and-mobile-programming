const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserService = require('./user');
const config = require('./config/config');
const middlewares = require('./middlewares');

const router = express.Router();

router.get('/checkToken', (req, res, next) => {
    const authHeader = req.cookies.jwtToken;
    if (authHeader) {
        jwt.verify(authHeader, config.jwtTokenSecret, error => {
            if (error) {
                const err = new Error('JWT ei validi');
                err.status = 401;
                next(err);
            }
            res.json(true);
        });
    } else {
        const err = new Error('JWT puuttuu');
        err.status = 401;
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    const foundUser = await UserService.findUserByUsername(username);

    if (foundUser) {
        const passwordsMatch = await bcrypt.compare(password, foundUser.password);

        if (passwordsMatch) {
            const accessToken = jwt.sign({ username: foundUser.username }, config.jwtTokenSecret);
            res.cookie('jwtToken', accessToken, { httpOnly: true }).sendStatus(204);
        } else {
            const err = new Error('Käyttäjänimi tai salasana väärin');
            err.status = 403;
            next(err);
        }
    } else {
        const err = new Error('Käyttäjänimi tai salasana väärin');
        err.status = 403;
        next(err);
    }
});

router.post('/reqister', async (req, res, next) => {
    const { username, password, firstname, lastname } = req.body;
    try {
        await UserService.registerNewUser(username, password, firstname, lastname);
        res.sendStatus(204);
    } catch (error) {
        error.status = 400;
        next(error);
    }
});

router.get('/logout', middlewares.withAuth, (req, res) => {
    res.clearCookie('jwtToken').sendStatus(204);
});

module.exports = router;
