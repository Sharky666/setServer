exports = module.exports = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
    res.header("Access-Control-Allow-Headers", `Origin, X-Requested-With, Content-Type, Accept, lobbykey, name, token, gameMode`);
    next();
}