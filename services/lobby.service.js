class LobbyService {
    // TODO: auth these lil shits! ;)
    constructor() {
        this.lobbies = []
    }

    // lobby methods
    pushLobby(lobby) {
        this.lobbies.push(lobby);
    }

    getLobbyByKey(lobbyKey) {
        lobbyKey = String(lobbyKey).toUpperCase();
        for (let i = 0; i < this.lobbies.length; i++) {
            if (lobbyKey === this.lobbies[i].key) return this.lobbies[i]
        }
        return false;
    }

    doesLobbyExist(lobbyKey) {
        for (let i = 0; i < this.lobbies.length; i++) {
            if (lobbyKey === this.lobbies[i].key) return true;
        }
        return false;
    }

    // client methods
    pushClient(lobbyKey, client) {
        this.getLobbyByKey(lobbyKey).clients.push(client);
    }
}

exports = module.exports = new LobbyService();