'use strict';

require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');
// const {router: localStrategy, jwtStrategy} = require('./auth');
// passport.use(localStrategy);
// passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/', jwtAuth, (req, res) => {
    return res.json({
        data: 'the Lion King 4KHD'
    });
});

module.exports = router;

    // // logout
    // res.render('layout/layout', {
    //     main: 'pages/dashboard'
    // });