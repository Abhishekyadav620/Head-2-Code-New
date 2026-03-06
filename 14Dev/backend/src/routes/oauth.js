const express = require('express');
const passport = require('passport');
const { oauthSuccess, oauthFailure } = require('../controllers/oauthController');

const oauthRouter = express.Router();

const ensureStrategy = (name) => (req, res, next) => {
    // passport exposes a private helper for lookup; safest lightweight check
    const strat = typeof passport._strategy === 'function' ? passport._strategy(name) : null;
    if (!strat) {
        return res.redirect(`/oauth/failure?provider=${encodeURIComponent(name)}`);
    }
    return next();
};

// Google OAuth
oauthRouter.get('/google', ensureStrategy('google'), passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
oauthRouter.get(
    '/google/callback',
    ensureStrategy('google'),
    passport.authenticate('google', { session: false, failureRedirect: '/oauth/failure?provider=google' }),
    oauthSuccess
);

oauthRouter.get('/failure', oauthFailure);

module.exports = oauthRouter;

