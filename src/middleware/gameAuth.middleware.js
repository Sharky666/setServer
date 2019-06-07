const utils = require("../utils/definitions").Game;
const resultHandling = require("../utils/functions").resultHandling;
const LobbyStatus = require("../utils/definitions").Lobby.LobbyStatuses;

exports = module.exports = (req, res, next) => {
    if (req.userData.lobby.status === LobbyStatus.STARTED) {
        next();
    }
    else {
        const result = resultHandling.getResultStruct();
        result.error = utils.gameErrors.DID_NOT_START_YET;
        resultHandling.handleResults(res, result);
    }
}