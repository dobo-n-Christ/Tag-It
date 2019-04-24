'use strict';

const {Strategy: LocalStrategy} = require('passport-local');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const {User} = require('../users');
const {JWT_SECRET} = require('../config');

const localStrategy = new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({username: username});
        if (!user) {
            throw {
                reason: 'Login Error',
                message: 'Incorrect username or password'
            }
        }
        const valid = await user.validatePassword(password);
        if (!valid) {
            throw {
                reason: 'Login Error',
                message: 'Incorrect username or password'
            }
        }
        return done(null, user);
    }
    catch (err) {
        if (err.reason === 'Login Error') {
            // console.log(err);
            return done(null, false, err);
        }
        return done(err, false);
    }
});

const jwtStrategy = new JwtStrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        algorithms: ['HS256']
    },
    (payload, done) => {
        done(null, payload.user);
    }
);

module.exports = {localStrategy, jwtStrategy};