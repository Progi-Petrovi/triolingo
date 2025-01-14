export class UserNotLoadedError extends Error {
    constructor(message = "User is not loaded.") {
        super(message);
        this.name = "UserNotLoadedError";
    }
}

// OVO OBRISAT
