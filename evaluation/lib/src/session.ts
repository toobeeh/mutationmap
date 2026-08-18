import {Wordle} from "./wordle.js";

export interface sessionResult {
    username: string;
    winStreak: number;
    averageGuesses: number;
}

export class Session {

    constructor(readonly _username: string) {

    }

    /**
     * The ordered list of games played in this session, earliest game at first index
     * @private
     */
    private _games: Array<Wordle> = [];

    /**
     * The username of the player for this session
     */
    public get username(): string {
        return this._username;
    }

    /**
     * The current win streak for this session, i.e. the number of consecutive games won,
     * skipping the current game if not finished
     */
    public get winStreak(): number {
        let streak = 0;
        for (let i = this._games.length - 2; i >= 0; i--) {
            if (this._games[i]?.won) {
                streak++;
            } else {
                break;
            }
        }

        if(this.currentGame?.won) {
            streak++;
        }

        return streak;
    }

    /**
     * The maximum win streak for this session, i.e. the highest number of consecutive games won at any point in the session
     */
    public get maxWinStreak(): number {
        let maxStreak = 0;
        let currentStreak = 0;
        for (const game of this._games) {
            if (game.won) {
                currentStreak++;
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                }
            } else {
                currentStreak = 0;
            }
        }
        return maxStreak;
    }

    /**
     * The average number of guesses for all games won in this session, or 0 if no games have been won
     */
    public get averageGuesses(): number {
        const wonGames = this._games.filter(game => game.won);
        if (wonGames.length === 0) {
            return 0;
        }
        const totalGuesses = wonGames.reduce((sum, game) => sum + game.guesses.length, 0);
        return totalGuesses / wonGames.length;
    }

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

    /**
     * Returns the leaderboard from localStorage, or an empty Map if no leaderboard is found
     */
    public getLeaderboard(): Map<string, sessionResult> {
        const leaderboard = localStorage.getItem('leaderboard');

        if(leaderboard === null) {
            return new Map<string, sessionResult>();
        }

        const parsedLeaderboard: [string, sessionResult][] = JSON.parse(leaderboard);
        return new Map<string, sessionResult>(parsedLeaderboard);
    }

    /**
     * Updates the leaderboard in localStorage with the current session's results.
     * If the player has played before, their previous results will be overwritten with the new results, if they are a new record.
     */
    public updateLeaderboard() {
        const leaderboard = this.getLeaderboard();
        const currentSessionResult: sessionResult = {
            username: this.username,
            winStreak: this.maxWinStreak,
            averageGuesses: this.averageGuesses
        };

        if(leaderboard.has(this.username)) {
            const previousResult = leaderboard.get(this.username);
            if (previousResult && currentSessionResult.winStreak < previousResult.winStreak) {
                return;
            }
        }

        leaderboard.set(this.username, currentSessionResult);
        localStorage.setItem('leaderboard', JSON.stringify(Array.from(leaderboard.entries())));
    }
}
