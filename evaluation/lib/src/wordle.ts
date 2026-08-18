import {Dictionary} from "./dictionary.js";

export enum CharacterStatus {
    Correct = 'correct',
    Present = 'present',
    Absent = 'absent',
    Idle = 'idle'
}

export class Wordle {

    /**
     * The length of the word to guess
     * @private
     */
    private readonly _wordLength = 5;

    /**
     * The dictionary of valid words
     * @private
     */
    private readonly _dictionary = new Dictionary();

    /**
     * The set of available characters for guessing
     * @private
     */
    private readonly _availableCharacters: ReadonlySet<string> = new Set('abcdefghijklmnopqrstuvwxyz'.split(''));

    /**
     * The word to guess
     * @private
     */
    private readonly _word: string;

    /**
     * The set of characters that have been used in previous guesses
     * @private
     */
    private _usedCharacters: Set<string> = new Set();

    /**
     * The ordered list of previous guesses, first guess at first index
     * @private
     */
    private _guesses: string[] = [];

    constructor() {
        this._word = this._dictionary.getRandomWord();
    }

    /**
     * Returns the ordered list of previous guesses, first guess at first index
     */
    public get guesses() {
        return this._guesses;
    }

    /**
     * Returns true if the game is finished, either by winning or by exhausting all attempts
     */
    public get finished() {
        return this._guesses.length >= this._wordLength || this.won;
    }

    /**
     * Returns true if the player has won the game by guessing the word correctly
     */
    public get won() {
        return this._guesses.length > 0 && this._guesses[this._guesses.length - 1] === this._word;
    }

    /**
     * Returns the word to guess
     */
    public get word() {
        return this._word;
    }

    /**
     * Returns the set of available characters for guessing, sorted alphabetically
     */
    public get characters() {
        return Array.from(this._availableCharacters).sort();
    }

    /**
     * Returns the remaining guesses the player has before the game is finished
     */
    public get remainingAttempts() {
        return this._wordLength - this._guesses.length;
    }

    /**
     * Guesses a word and returns true if the game is finished after the guess, false otherwise
     * @param word
     */
    public guessWord(word: string) {
        word = word.toLowerCase();

        if (this.finished) {
            throw new Error("Game is finished");
        }

        if (word.length !== this._wordLength) {
            throw new Error(`Word must be ${this._wordLength} characters long`);
        }

        if (!this._dictionary.hasWord(word)) {
            throw new Error("Word not in dictionary");
        }

        const invalidChars = word.split('').filter(char => !this._availableCharacters.has(char));
        if (invalidChars.length > 0) {
            throw new Error(`Word contains invalid characters: ${invalidChars.join(', ')}`);
        }

        this._guesses.push(word);

        for (const char of word) {
            this._usedCharacters.add(char);
        }

        return this.finished;
    }

    /**
     * Returns the status of a character based on the previous guesses
     * @param char
     */
    public characterStatus(char: string): CharacterStatus {

        /* character has not been used in any of the previous guesses */
        if (!this._usedCharacters.has(char)) {
            return CharacterStatus.Idle;
        }

        /* character has been used at correct location in one of the previous guessed */
        if(this.guesses.some(guess => {
            return guess.split('').some((character, index) =>
                character === char && this._word[index] === char)
        })) {
            return CharacterStatus.Correct;
        }

        /* character has been used at incorrect location in one of the previous guessed */
        if (this._word.includes(char)) {
            return CharacterStatus.Present;
        }

        /* character has been used in one of the previous guesses, but is not contained in the word */
        return CharacterStatus.Absent;
    }

    /**
     * Returns the correctness of a character at a specific index in the word to guess
     * @param char
     * @param index
     */
    public characterGuessStatus(char: string, index: number): CharacterStatus {
        if (this._word[index] === char) {
            return CharacterStatus.Correct;
        }

        if (this._word.includes(char)) {
            return CharacterStatus.Present;
        }

        return CharacterStatus.Absent;
    }
}
