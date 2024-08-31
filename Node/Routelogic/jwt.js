const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log(authHeader);
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userEmail = decoded.email; // Extract email from the decoded token
        console.log(req.userEmail);
        next();
        
    } 
    catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authenticate;
