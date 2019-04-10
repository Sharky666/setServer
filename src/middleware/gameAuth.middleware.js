const LobbyStatus = require("../utils/definitions").LobbyStatus;
exports = module.exports = (req, res, next) => {
    if (req.userData.lobby.status === LobbyStatus.STARTED) {
        next();
    }
    else {
        res.status(403).json({
            "error": "the fuycking game dsdin't even st art yet ;)"
        });
    }
}