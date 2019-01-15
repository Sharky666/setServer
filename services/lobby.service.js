class LobbyService {

    constructor() {
        this.lobbies = []
    }

    // lobby methods
    pushLobby(lobby) {
        this.lobbies.push(lobby);
    }

    getLobbyByKey(lobbyKey) {
        for (let i = 0; i < this.lobbies.length; i++) {
            if (lobbyKey === this.lobbies[i].key) return this.lobbies[i];
        }
    }

    // client methods
    pushClient(lobbyKey, client) {
        getLobbyByKey(lobbyKey).clients.push(client);
    }
}

exports = module.exports = new LobbyService();