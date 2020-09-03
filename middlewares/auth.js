'use strict'
const { verifyToken } = require('../helpers/jwtHelper');
// Controllers
const { deactivateSession, getSessionMiddleware } = require('../controllers/sessionController');

const checkAuth = async (req, res, next) => {
    try {
        if (! 'authorization' in req.headers)
            return res.status(401).json({result: 'Error', error: true, errorCode: 'missingToken'});
        // Get token
        let token = req.headers.authorization;
        // Verify token
        let payload = await verifyToken(token);
        if (!payload){
            // Deactivate session
            deactivateSession(token);
            if (payload === -1)
                return res.status(401).json({ result: 'Error', error: true, errorCode: 'expSession' });
            return res.status(403).json({ result: 'Error', error: true, errorCode: 'badToken' });
        }
        // Verify session
        let session= await getSessionMiddleware(token);
        if (!(session && session.active))
            return res.status(401).json({ result: 'Error', error: true, errorCode: 'invalidSession' });
        // Pass session data
        req.session = session;
        next();
    } catch(error){
        console.log(error);
        res.status(500).json({ result: 'Error', error: true, errorCode: 'serverError' });
    }
}

module.exports = { checkAuth };