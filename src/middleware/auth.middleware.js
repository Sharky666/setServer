exports = module.exports = (req, res, next) => {
    if (!req.userData) {
        res.status(401)
            .json({
                error: 'lol are you fucking retarded? you are not authorized'
            });
    }
    else {
        next();
    }
};
