const lobbyService = require('../services/lobby.service');

// TODO: check out https://www.jwt.io
exports = module.exports = (req, res, next) => {
    const clientToken = req.headers.token;
    const lobbyKey = req.headers.lobbykey;
    let client = null;
    let lobby = null;
    if (lobbyKey) {
        lobby = lobbyService.getLobbyByKey(lobbyKey);
        if (lobby && clientToken) {
            client = lobbyService.getClientByToken(clientToken);
            if (client) {
                req.userData = {
                    lobby,
                    client
                };
                req.getGameData = () => {
                    const gameMode = lobby.gameMode;
                    if (gameMode) {
                        return lobby.games[gameMode];
                    }
                    else {
                        return null;
                    }
                }
            }
        }
    }
    next();
};
