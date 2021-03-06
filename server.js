'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const morgan = require('morgan');
const {router: usersRouter} = require('./users');
const {router: authRouter} = require('./auth');
const {PORT, DATABASE_URL} = require('./config');
const app = express();
app.use(morgan('common'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.render('layout/layout', {
        main: 'pages/index'
    });
});

app.get('/login', (req, res) => {
    res.render('layout/layout', {
        main: 'pages/login'
    });
});

app.get('/register', (req, res) => {
    res.render('layout/layout', {
        main: 'pages/register'
    });
});

app.get('/dashboard', (req, res) => {
    // logout
    res.render('layout/layout', {
        main: 'pages/dashboard'
    });
});

app.use('*', (req, res) => {
    return res.status(404).json({message: 'Not Found'});
});

let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            databaseUrl,
            {
                useNewUrlParser: true,
                useCreateIndex: true
            },
            err => {
                if (err) {
                    return reject(err);
                }
                server = app.listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
            }
        );
    });
}

function closeServer() {
    return mongoose.disconnect()
    .then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL)
    .catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};