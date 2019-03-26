class GameService {
    constructor() {
        this.initGames();
    }

    initGames() {
        this.gameServices = {
            randomNumber: require("./games/randomNumber.service")
        }
    }

    startGame(gameName, gameData) {
        const service = this.getGameService(gameName);
        if (service) {
            service.start(gameData);
        }
    }

    getGameService(gameName) {
        return this.gameServices[gameName];
    }
}

exports = module.exports = new GameService();