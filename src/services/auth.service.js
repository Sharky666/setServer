const lobbyService = require('../services/lobby.service');

class AuthService {
    constructor() {
        this.defaultKeyLength = 4;
        this.maxNameLength = 20;
    }

    validateClientName(clientName, lobby) {
        if (!clientName) return false;
        clientName = String(clientName);
        if (clientName.length > this.givenMaxNameLength) return false;
        // if the client name already exists in the lobby, return false, otherwise return the name.
        return lobby.clients.find(e => e.name === clientName) ? false : clientName;
    }

    // validateClientToken(clientToken, lobby) {
    //     if (!clientToken) return false;
    //     // if the client token exists in the lobby, return true, otherwise false.
    //     return lobby.clients.find(e => e.clientToken === clientToken) ? clientToken : false
    // }

    // validateAndGetLobby(lobbyKey) {
    //     if (!lobbyKey) return false;
    //     const lobbies = lobbyService.getLobbies();
    //     for (let i = 0; i < lobbies.length; i++) {
    //         const currentLobbyKey = lobbies[i].key;
    //         if (lobbyKey === currentLobbyKey) return lobbies[i];
    //     }
    //     return false;
    // }
}

exports = module.exports = new AuthService();
