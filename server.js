'use strict';

const express = require('express');
const ejs = require('ejs');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('layout/layout', {
        main: 'pages/index'
    });
});

app.get('/dashboard', (req, res) => {
    // logout
    res.render('layout/layout', {
        main: 'pages/dashboard'
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

if(require.main === module) {
    app.listen(process.env.PORT || 8080, function() {
        console.log(`Your app is listening on port ${this.address().port}`);
    });
};

module.exports = app;