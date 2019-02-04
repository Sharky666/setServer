const lobbyService = require('../services/lobby.service');
const auth = require('../services/auth.service');
// TODO: find room and validate token
const defaultKeyLength = 4;
const maxNameLength = 20;

exports = module.exports = (req, res, next) => {
    // TODO: find a good way of validating and saving data to the 'userData'

    const lobby = auth.validateClientLobbyKey(req.headers.key, defaultKeyLength);
    let userData = {
        // the following variables will be set:

        // lobby
        // name
        // token
    };

    let value = lobby

    // lobby
    if(value) {
        userData.lobby = value
        value = auth.validateClientName(req.headers.name, lobby, maxNameLength)
    }

    // name
    if(value) {
        userData.name = value
        value = auth.validateClientToken(value, lobby)
    }

    // token
    if(value) {
        userData.token = value
    }
    
    console.log(userData)
    req.userData = userData;
    next();
}