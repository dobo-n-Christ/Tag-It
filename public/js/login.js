'use strict';

async function redirectIfLoggedIn() {
    const token = sessionStorage.getItem('authToken');
    if (token) {
        const res = await fetch('/api/users', {headers: {'Authorization': `Bearer ${token}`}});
        if (res.status === 200) {
            window.location.replace('dashboard');
            return;
        }
    }
}

redirectIfLoggedIn();

console.log('login.js loaded');

function clearError() {
    $('.error-message')
        .css('display','none')
        .empty();
}

function showError(message) {
    $('.error-message')
        .text(message)
        .css('display','block');
}

async function goToDashboard(res) {
    try {
        const token = res.authToken;
        const response = await fetch('dashboard', {headers: {'Authorization': `Bearer ${token}`}});
        if (response.status !== 200) {
            showError('Server error: Administrator has been notified');
            return;
        }
        sessionStorage.setItem('authToken', token);
        window.location.href = 'dashboard';
        console.log('dashboard finally loaded');  
    }
    catch (err) {
        console.error(err);
    }
}

async function loginUser(loginData) {
    try {
        const response = await fetch(
            '/api/auth/login',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(loginData)
            }
        );
        if (response.status === 401) {
            showError('Incorrect username or password');
            return;
        }
        if (response.status === 400) {
            showError('Missing username or password');
            return;
        }
        if (response.status !== 200) {
            showError('Server Error: Administrator has been notified');
            return;
        }
        const body = await response.json();
        goToDashboard(body);
    }
    catch(err) {
        console.error(err);
    }
}

function watchLoginForm() {
    $('#js-login-form').submit(event => {
        event.preventDefault();
        clearError();
        sessionStorage.clear();
        const username = $('#js-username').val();
        const password = $('#js-password').val();
        const loginData = {username, password};
        loginUser(loginData);
    });
}

$(watchLoginForm);