const resultHandling = require("../utils/functions").resultHandling;
const utils = require("../utils/definitions").GameStatus
const lobbyService = require("../services/lobby.service");

class GameService {
    constructor() {
        this.initGames();
    }

    initGames() {
        this.gameServices = {
            randomNumber: require("./games/randomNumber.service")
        }
    }

    startGame(gameName, gameData, clients) {
        const final = resultHandling.getResultStruct();
        const service = this.getGameService(gameName);
        if (service) {
            return service.start(gameData, clients);
        }
        final.error = utils.NOT_FOUND;
        return final
    }

    endGame(lobbyKey) {
        lobbyService.endLobbyByKey(lobbyKey);
    };

    /**
     * Will be triggered when a game emits and end event
     */
    onGameEnd(lobby){

    }

    getGameService(gameName) {
        return this.gameServices[gameName];
    }
}

exports = module.exports = new GameService();