import {Wordle} from "./wordle.js";

export class Session {

    /**
     * The ordered list of games played in this session, earliest game at first index
     * @private
     */
    private _games: Array<Wordle> = [];

    /**
     * All games played in this session, earliest game at first index
     */
    public get games(): ReadonlyArray<Wordle> {
        return this._games;
    }

    /**
     * The current game, or undefined if no games have been played yet
     */
    public get currentGame(): Wordle | undefined {
        return this._games[this._games.length - 1];
    }

    /**
     * The number of games won in this session
     */
    public get gamesWon(): number {
        return this._games.filter(game => game.won).length;
    }

    /**
     * The number of games played in this session
     */
    public get gamesPlayed(): number {
        return this._games.length;
    }

    /**
     * Starts a new game and adds it to this session
     */
    public startNewGame() {
        const game = new Wordle();
        this._games.push(game);
        return game;
    }
}
