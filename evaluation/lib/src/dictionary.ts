import {wordleWords} from "./words.js";

export class Dictionary {

    /**
     * All valid words, in lowercase
     * @private
     */
    private readonly _words = wordleWords.map(word => word.toLowerCase());

    /**
     * Returns all valid words, in lowercase
     */
    public get words() {
        return this._words as ReadonlyArray<string>;
    }

    /**
     * Returns a random word from the dictionary
     */
    public getRandomWord() {
        const randomIndex = Math.floor(Math.random() * this._words.length);
        return this._words[randomIndex] as string;
    }

    /**
     * Checks if the dictionary contains the given word
     * @param word
     */
    public hasWord(word: string) {
        return this._words.includes(word.toLowerCase());
    }
}
