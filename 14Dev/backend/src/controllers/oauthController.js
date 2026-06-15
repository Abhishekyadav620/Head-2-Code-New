const jwt = require('jsonwebtoken');

function getFrontendBase() {
    return process.env.FRONTEND_URL || 'http://localhost:5173';
}

const oauthSuccess = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.redirect(`${getFrontendBase()}/login?error=oauth_failed`);
        }

        const token = jwt.sign(
            { _id: user._id, emailId: user.emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );

        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
        return res.redirect(`${getFrontendBase()}/`);//After login → go to homepage
    } catch (err) {
        return res.redirect(`${getFrontendBase()}/login?error=oauth_failed`);
    }
};

const oauthFailure = (req, res) => {
    const provider = req.query.provider || 'oauth';
    return res.redirect(`${getFrontendBase()}/login?error=${encodeURIComponent(String(provider))}`);
};

module.exports = { oauthSuccess, oauthFailure };

