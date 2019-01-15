class LobbyService {
    lobbies = []
    constructor() {}

    // lobby methods
    pushLobby(lobby) {
        lobbies.push(lobby);
    }

    getLobbyByKey(lobbyKey) {
        for (let i = 0; i < lobbies.length; i++) {
            if (lobbyKey === lobbies[i].key) return lobbies[i];
        }
    }

    // client methods
    pushClient(lobbyKey, client) {
        getLobbyByKey(lobbyKey).clients.push(client);
    }
}

exports = module.exports = new LobbyService();