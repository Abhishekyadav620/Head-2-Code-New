const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

function getCallbackBase() {
    
    return process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;
}

module.exports = function initPassport(passport) {
    const backendBase = getCallbackBase();

    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        passport.use(new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${backendBase}/oauth/google/callback`,
                // callbackURL: "http://head2code.duckdns.org/oauth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const googleId = profile?.id;
                    const email = profile?.emails?.[0]?.value?.toLowerCase();
                    const firstName = profile?.name?.givenName || profile?.displayName || 'User';
                    const lastName = profile?.name?.familyName || '';

                    if (!googleId) return done(new Error('Google profile id missing'));
                    if (!email) return done(new Error('Google email missing'));

                    let user = await User.findOne({ googleOAuthId: googleId });
                    if (user) return done(null, user);

                    // If user exists with same email, link accounts
                    user = await User.findOne({ emailId: email });
                    if (user) {
                        user.googleOAuthId = googleId;
                        await user.save();
                        return done(null, user);
                    }

                    const randomPassword = await bcrypt.hash(`oauth:${googleId}:${Date.now()}`, 10);
                    user = await User.create({
                        firstName,
                        lastName,
                        emailId: email,
                        password: randomPassword,
                        role: 'user',
                        googleOAuthId: googleId,
                    });

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
));
    }

    // We are stateless (JWT cookie), so no sessions required.
    passport.serializeUser((user, done) => done(null, user._id));//serialize user save the user.__id in the session
    passport.deserializeUser(async (id, done) => {//deserialize user uses the id to fetch data from the document for the fulture login
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};