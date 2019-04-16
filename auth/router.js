'use strict';

require('dotenv').config();
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {localStrategy, jwtStrategy} = require('./strategies');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();
passport.use(localStrategy);
passport.use(jwtStrategy);

const createAuthToken = function(user) {
    return jwt.sign({user}, config.JWT_SECRET, 
        {
            subject: user.username,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256'
        });
}

const localAuth = passport.authenticate('local', {session: false});

router.use(bodyParser.json());

router.post('/login', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user.serialize());
    res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
});

module.exports = {router};