
const jwt = require('jsonwebtoken');
const secret = "thisascretkey..shhhh";

module.exports.secret = secret;

// Authenticate Middleware with Request Logging
module.exports.authenticate = (req, res, next) => {
    console.log('Request Headers:', req.headers); 
    console.log('Request Cookies:', req.cookies); 

    const token = req.cookies.userToken;

    if (!token) {
        console.log('No token found in cookies'); // Log when no token is found
        res.status(401).json({ verified: false, message: 'Token missing' });
    } else {
        jwt.verify(token, secret, (err, payload) => {
            if (err) {
                console.log('Token verification error:', err); // Log when token verification fails
                res.status(401).json({ verified: false, message: 'Token verification failed' });
            } else {
                // Include user information in req.user
                console.log('Token verified successfully'); // Log when token is verified

                const currentTimestamp = Math.floor(Date.now() / 1000); 
                if (payload.exp && payload.exp < currentTimestamp) {
                    console.log('Token has expired'); // Log when the token has expired
                    res.status(401).json({ verified: false, message: 'Token has expired' });
                } else {
                    next();
                }
            }
        });
    }
};
