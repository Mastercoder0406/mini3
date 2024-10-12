const User = require('../models/user');
const express = require('express');
const router = express.Router();
const passport = require('passport');// for validation

//register user controls
module.exports.renderregister = (req, res) => {
    res.render('users/register');
}

//register
module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/villas');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

//loginform 
module.exports.renderlogin = (req, res) => {
    res.render('users/login');
}
module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/villas';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}


//logout form controls 
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/villas');
    });
}