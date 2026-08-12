export class Wordle {

  private usedCharacters: Set<string> = new Set();
  private readonly _words: ReadonlySet<string>;
  private readonly availableCharacters: ReadonlySet<string> = new Set('abcdefghijklmnopqrstuvwxyz 1234567890.-'.split(''));
  private _guesses: string[] = [];
  private _word: string;
  private readonly _wordLength: number;

  constructor(
    words: ReadonlySet<string>
  ) {
    this._words = new Set([...(words.values())].map(word => word.toLowerCase()));
    this._wordLength = this._words.values().next().value.length;

    this.startGame();
  }

  public get wordLength(){
    return this._wordLength;
  }

  public get guesses() {
    return this._guesses;
  }

  public get finished() {
    return this._guesses.length >= this._wordLength || this.won;
  }

  public get won() {
    return this._guesses.length > 0 && this._guesses[this._guesses.length - 1] === this._word;
  }

  public get characters() {
    return Array.from(this.availableCharacters).sort();
  }

  public get remainingAttempts() {
    return this._wordLength - this._guesses.length;
  }

  public startGame() {
    this.usedCharacters.clear();
    this._guesses = [];

    const randomIndex = Math.floor(Math.random() * this._words.size);
    this._word = Array.from(this._words)[randomIndex];
  }

  public guessWord(word: string) {
    word = word.toLowerCase();

    if (this.finished) {
      throw new Error("Game is finished");
    }

    if (word.length !== this._wordLength) {
      throw new Error(`Word must be ${this._wordLength} characters long`);
    }

    if (!this._words.has(word)) {
      throw new Error("Word not in dictionary");
    }

    const invalidChars = word.split('').filter(char => !this.availableCharacters.has(char));
    if (invalidChars.length > 0) {
      throw new Error(`Word contains invalid characters: ${invalidChars.join(', ')}`);
    }

    this._guesses.push(word);

    for (const char of word) {
      this.usedCharacters.add(char);
    }

    return this.finished;
  }

  public characterStatus(char: string): 'correct' | 'present' | 'idle' | 'absent' {
    if (!this.usedCharacters.has(char)) {
      return 'idle';
    }

    if(this.guesses.some(guess => {
      return guess.split('').some((character, index) =>
        character === char && this._word[index] === char)
    })) {
      return 'correct';
    }

    if (this._word.includes(char)) {
      return 'present';
    }

    return 'absent';
  }

  public characterGuessStatus(char: string, index: number): 'correct' | 'present' | 'absent' {
    if (this._word[index] === char) {
      return 'correct';
    }

    if (this._word.includes(char)) {
      return 'present';
    }

    return 'absent';
  }
}
