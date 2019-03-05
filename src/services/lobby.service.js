class LobbyService {
    // TODO: auth these lil shits! ;)
    constructor() {
        this.defaultKeyLength = 4;
        this.abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.lobbies = [];
        this.allowedGames = ['randomNum'];
    }

    // lobby methods
    // getters

    getAllowedGames() {
        return this.allowedGames;
    }

    getLobbies() {
        return this.lobbies;
    }

    getClientByToken(token) {
        let client = null;
        this.lobbies.some((l) => {
            client = l.clients.find(c => c.token === token);
            if (client) {
                return true;
            }
        });
        return client;
    }

    getLobbyByKey(lobbyKey) {
        lobbyKey = this.prepareClientLobbyKey(lobbyKey);
        if (lobbyKey) {
            for (let i = 0; i < this.lobbies.length; i++) {
                if (lobbyKey === this.lobbies[i].key) {
                    return this.lobbies[i];
                }
            }
        }
        return false;
    }
    // setters

    setLobbyStatus(lobby, status) {
        lobby.status = status;
    }

    setLobbyGameMode(lobbyKey, gameMode) {
        for (let i = 0; i < this.lobbies.length; i++) {
            const currentLobby = this.lobbies[i];
            if (lobbyKey === currentLobby.key) {
                currentLobby.gameMode = gameMode;
            }
        }
    }

    pushLobby() {
        const lobbyKey = this.generateKey(this.abc, this.defaultKeyLength);
        const lobby = {
            key: lobbyKey,
            game: 'randNum',
            status: 'waiting',
            clients: [
                // clients go in here
            ],
            games: []
        };
        this.lobbies.push(lobby);
        return lobbyKey;
    }

    doesLobbyExist(lobbyKey) {
        for (let i = 0; i < this.lobbies.length; i++) {
            if (lobbyKey === this.lobbies[i].key) return true;
        }
        return false;
    }
    // client methods

    pushClient(name, token, lobby) {
        lobby.clients.push({
            name,
            token,
            isOwner: lobby.clients.length === 0
        });
    }
    // generators

    generateKey(arr, length) {
        let key = '';
        // generating the key
        for (let i = 0; i < length; i++) {
            key = key + arr[Math.floor(Math.random() * arr.length)];
        }
        // if the key is equal to another lobby's key, run again.
        if (this.doesLobbyExist(key)) {
            return this.generateKey(arr, length);
        }
        return key;
    }

    prepareClientLobbyKey(clientKey) {
        // if clientKey doesn't exist
        if (!clientKey) return false;
        // set the clientKey to a string (so we could check it's length)
        clientKey = String(clientKey);
        clientKey = clientKey.toUpperCase();
        // if the clientkey's length isn't the default key length
        if (clientKey.length !== this.defaultKeyLength) return false;
        // if the key is prepared, return the key, otherwise false.
        return clientKey || false;
    }
}

exports = module.exports = new LobbyService();
