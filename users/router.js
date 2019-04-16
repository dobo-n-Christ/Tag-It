'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, async (req, res) => {
    try {
        const requiredFields = ['username', 'password'];
        const missingField = await requiredFields.find(field => 
            !(field in req.body));
        if (missingField) {
            throw {
                code: 422,
                reason: 'Validation Error',
                message: 'Field missing',
                location: missingField
            }
        }
        const stringFields = ['username', 'password', 'firstName', 'lastName'];
        const nonStringField = await stringFields.find(field => 
            field in req.body && typeof req.body[field] !== 'string');
        if (nonStringField) {
            throw {
                code: 422,
                reason: 'Validation Error',
                message: 'Incorrect field type: string expected',
                location: nonStringField
            }
        }
        const explicitlyTrimmedFields = ['username', 'password'];
        const untrimmedField = await explicitlyTrimmedFields.find(field => 
            req.body[field].trim() !== req.body[field]);
        if (untrimmedField) {
            throw {
                code: 422,
                reason: 'Validation Error',
                message: 'Field cannot start or end with whitespace',
                location: untrimmedField
            }
        }
        const sizedFields = {
            username: {
                min: 1
            },
            password: {
                min: 10,
                max: 72
            }
        }
        const tooShortField = await Object.keys(sizedFields).find(field => 
            'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min);
        const tooLongField = await Object.keys(sizedFields).find(field => 
            'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max);
        if (tooShortField || tooLongField) {
            throw {
                code: 422,
                reason: 'Validation Error',
                message: tooShortField
                ? `Field must have at least ${sizedFields[tooShortField].min} characters`
                : `Field must have at most ${sizedFields[tooLongField].max} characters`,
                location: tooShortField || tooLongField
            }
        }
        let {username, password, firstName = '', lastName = ''} = req.body;
        firstName = firstName.trim();
        lastName = lastName.trim();
        const count = await User.find({username}).countDocuments();
        if (count > 0) {
            throw {
                code: 422,
                reason: 'Validation Error',
                message: 'Username already taken',
                location: 'username'
            }
        }
        const hash = await User.hashPassword(password);
        const user = await User.create({
            username,
            password: hash,
            firstName,
            lastName
        });
        return res.status(201).json(user.serialize());
    }
    catch (err) {
        if (err.reason === 'Validation Error') {
            return res.status(err.code).json(err);
        }
        console.log(err);
        return res.status(500).json({message: 'Internal server error'});
    }
});

module.exports = {router};

//     return User.find({username}).count()
//     .then(count => {
//         if (count > 0) {
//             return Promise.reject({
//                 code: 422,
//                 reason: 'Validation Error',
//                 message: 'Username already taken',
//                 location: 'username'
//             });
//         };
//         return User.hashPassword(password);
//     })
//     .then(hash => {
//         return User.create({
//             username,
//             password: hash,
//             firstName,
//             lastName
//         });
//     })
//     .then(user => {
//         return res.status(201).json(user.serialize());
//     })
//     .catch(err => {
//         if (err.reason === 'Validation Error') {
//             return res.status(err.code).json(err);
//         };
//         res.status(500).json({message: 'Internal server error'});
//     });
// });
