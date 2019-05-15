const Util = require("../utils/definitions");
const gameService = require("./game.service");
const resultHandling = require("../utils/functions").resultHandling;

class LobbyService {
    // TODO: auth these lil shits! ;)
    constructor() {
        this.defaultKeyLength = 4;
        this.abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.lobbies = [];
        this.allowedGames = ['randomNumber'];
        this.initListeners();
    }

    initListeners() {
        gameService.gameStatus$.subscribe(this.onGameStatusChange.bind(this));
    }

    onGameStatusChange(statusEvent) {
        if (statusEvent.status === Util.GameStatus.COMPLETED) {
            this.endLobbyByKey(statusEvent.lobbyKey);
        }
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

    getLobbyStatus(lobby) {
        return lobby.status;
    }

    startLobby(lobby) {
        const final = resultHandling.getResultStruct();
        const gameMode = lobby.gameMode;
        let gameData = lobby.games[gameMode];
        if (this.getLobbyStatus(lobby) === Util.LobbyStatus.STARTED) {
            final.error = Util.GameStatus.ALREADY_STARTED;
        }
        else {
            gameData = lobby.games[gameMode] = {};
            gameService.startGame(gameMode, gameData, lobby.clients);
            this.setLobbyStatus(lobby, Util.LobbyStatus.STARTED);
            final.result = Util.Global.OK;
        }
        return final
    }

    endLobbyByKey(lobbyKey) {
        const lobby = this.lobbies.find(l => {
            return l.key === lobbyKey;
        });
        if (lobby) {
            this.setLobbyStatus(lobby, Util.LobbyStatus.IDLE);
        }
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
        const final = resultHandling.getResultStruct();
        const lobbyKey = this.generateKey(this.abc, this.defaultKeyLength);
        final.result = lobbyKey;
        const lobby = {
                key: lobbyKey,
                status: Util.LobbyStatus.IDLE,
                clients: [
                    // clients go in here
                ],
                games: {}
            };
        this.lobbies.push(lobby);
        return final;
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
