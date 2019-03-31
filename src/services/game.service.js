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
        //TODO: everygame should start with different arguments (for example randomNumber needs to know about his clients~).
        const service = this.getGameService(gameName);
        if (service) {
            service.start(gameData, clients);
        }
    }

    getGameService(gameName) {
        return this.gameServices[gameName];
    }
}

exports = module.exports = new GameService();