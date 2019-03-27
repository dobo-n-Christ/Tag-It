'use strict';

const express = require('express');
const ejs = require('ejs');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/dashboard', (req, res) => {
    res.render('pages/dashboard');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/signup', (req, res) => {
    res.render('pages/signup');
});

if(require.main === module) {
    app.listen(process.env.PORT || 8080, function() {
        console.log(`Your app is listening on port ${this.address().port}`);
    });
};

module.exports = app;