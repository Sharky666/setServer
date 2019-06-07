exports = module.exports = {
    Global: {
        OK: "Ok"
    },
    Client: {
        ALREADY_EXISTS: "Name already exsits",
        TOO_LONG: "Name is too long",
        WRONG_KEY: "Incorrect lobby key",
        BAD_NAME: "Bad name",
        UNAUTHORIZED: "You are unauthorized to perform this request"
    },
    Lobby: {
        LobbyStatuses: {
            STARTED: "STARTED",
            IDLE: "IDLE",
        },
        LobbyErrors: {
            NO_GAMEMODE_FOUND: "No gamemode found"
        }
    },
    Game: {
        GameStatuses: {
            COMPLETED: "COMPLETED",
        },
        gameErrors: {
            NOT_FOUND: "Game wasn't found",
            ALREADY_STARTED: "Game already started",
            DID_NOT_START_YET: "The fucking game didn't even start yet ;)"
        }
    },
    randomNumber: {
        Results: {
            Ok: "Ok",
            CORRECT: "Correct",
            TOO_BIG: "Too big",
            TOO_SMALL: "Too small"
        },
        Errors: {
            INVALID_NUM: "Invalid number",
            ALREADY_GUESSED: "Already guessed",
            ALREADY_STARTED: "Already started",
        }
    }
};
