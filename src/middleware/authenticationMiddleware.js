const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticationMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: 'No token provided',
            status: 'ERROR'
        });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'Invalid token',
                status: 'ERROR'
            });
        }

        if (user?.isAdmin) {
            req.user = user;
            next();
        } else {
            return res.status(403).json({
                message: 'Unauthorized access',
                status: 'ERROR'
            });
        }
    });
};

const authenticationUserMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: 'No token provided',
            status: 'ERROR'
        });
    }

    const token = authHeader.split(' ')[1];
    const userId = req.params.id;

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'Invalid token',
                status: 'ERROR'
            });
        }

        if (user?.isAdmin || user?.id === userId) {
            req.user = user;
            next();
        } else {
            return res.status(403).json({
                message: 'Unauthorized access',
                status: 'ERROR'
            });
        }
    });
};

module.exports = {
    authenticationMiddleWare,
    authenticationUserMiddleWare
};
