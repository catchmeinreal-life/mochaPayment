
function authenticate(req, res, next) {
    console.log('Authentication middleware triggered:', req.method, req.url, req.headers);
    next();
    // Check if the user is authenticated
    // if (req.isAuthenticated()) {
    //     return next(); // User is authenticated, proceed to the next middleware or route handler
    // }
    
    // If not authenticated, send an unauthorized response
    // res.status(401).json({ message: 'Unauthorized access' });
}

module.exports = authenticate;