const lobbyService = require('../services/lobby.service')

class AuthService {
    constructor() {
        this.defaultKeyLength = 4;
        this.maxNameLength = 20;
    }

    validateClientName(clientName, lobby, givenMaxNameLength) {
        if (!clientName) return false;
        clientName = String(clientName);
        if (clientName.length > givenMaxNameLength) return false;
        // if the client name already exists in the lobby, return false, otherwise return the name.
        return lobby.clients.find(e => e.clientName === clientName) ? false : clientName
    }
    
    validateClientToken(clientToken, lobby) {
        if (!clientToken) return false;
        // if the client token exists in the lobby, return true, otherwise false.
        return lobby.clients.find(e => e.clientToken === clientToken) ? clientToken : false
    }

    validateClientLobbyKey(clientKey, givenDefaultKeyLength) {
        // if clientKey doesn't exist
        if (!clientKey) return false;
        // set the clientKey to a string (so we could check it's length)
        clientKey = String(clientKey);
        clientKey = clientKey.toUpperCase()
        // if the clientkey's length isn't the default key length
        if (clientKey.length !== givenDefaultKeyLength) return false;
        // if the lobby exists, return the key, otherwise false.
        const lobby = lobbyService.getLobbyByKey(clientKey)
        return lobby ? lobby : false;
    }
}

exports = module.exports = new AuthService()