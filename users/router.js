'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => {
        !(field in req.body);
    });
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'Validation Error',
            message: 'Field missing',
            location: missingField
        });
    };
    const stringFields = ['username', 'password', 'firstName', 'lastName'];
    const nonStringField = stringFields.find(field => {
        (field in req.body) && typeof req.body[field] !== 'string';
    });
    if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'Validation Error',
            message: 'Incorrect field type: string expected',
            location: nonStringField
        });
    };
    const explicitlyTrimmedFields = ['username', 'password'];
    const untrimmedField = explicitlyTrimmedFields.find(field => {
        req.body[field].trim() !== req.body[field];
    });
    if (untrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'Validation Error',
            message: 'Field cannot start or end with whitespace',
            location: untrimmedField
        });
    };
    const sizedFields = {
        username: {
            min: 1
        },
        password: {
            min: 10,
            max: 72
        }
    };
    const tooShortField = Object.keys(sizedFields).find(field => {
        'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min;
    });
    const tooLongField = Object.keys(sizedFields).find(field => {
        'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max;
    });
    if (tooShortField || tooLongField) {
        return res.status(422).json({
            code: 422,
            reason: 'Validation Error',
            message: tooShortField
            ? `Field must have at least ${sizedFields[tooShortField].min} characters`
            : `Field must have at most ${sizedFields[tooLongField].max} characters`,
            location: tooShortField || tooLongField
        });
    };
    let {username, password, firstName = '', lastName = ''} = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();
    return User.find({username}).count()
    .then(count => {
        if (count > 0) {
            return Promise.reject({
                code: 422,
                reason: 'Validation Error',
                message: 'Username already taken',
                location: 'username'
            });
        };
        return User.hashPassword(password);
    })
    .then(hash => {
        return User.create({
            username,
            password: hash,
            firstName,
            lastName
        });
    })
    .then(user => {
        return res.status(201).json(user.serialize());
    })
    .catch(err => {
        if (err.reason === 'Validation Error') {
            return res.status(err.code).json(err);
        };
        res.status(500).json({message: 'Internal server error'});
    });
});

module.exports = {router};