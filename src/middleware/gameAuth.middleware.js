const resultHandling = require("../utils/functions").resultHandling;
const LobbyStatus = require("../utils/definitions").Lobby.LobbyStatuses;

exports = module.exports = (req, res, next) => {
    if (req.userData.lobby.status === LobbyStatus.STARTED) {
        next();
    }
    else {
        // res.status(403).json({
        //     "error": "the fuycking game dsdin't even st art yet ;)"
        // });
        const result = resultHandling.getResultStruct();
        result.error =
    }
}