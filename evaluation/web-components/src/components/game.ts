import {type Session, Wordle} from "wordle-lib";
import {WordleCharacter} from "./character.ts";
import {WordleGuess} from "./guess.ts";

export class WordleGame extends HTMLElement {

    private _session?: Session;
    private _elements?: {
        guessesDiv: HTMLDivElement;
        charactersDiv: HTMLDivElement;
        roundSpan: HTMLSpanElement;
        winStreakSpan: HTMLSpanElement;
        gameDiv: HTMLDivElement;
        startBtn: HTMLButtonElement;
    };

    private _currentGuess = " ".repeat(5);
    private readonly _keydownHandler = this.keydownHandler.bind(this);

    public get session() {
        return this._session;
    }

    public set session(session: Session) {
        this._session = session;

        if(this._elements === undefined) {
            console.warn("Elements not initialized yet");
            return;
        }
        this.buildCleanGame(this._elements.guessesDiv, this._elements.charactersDiv, this.session.currentGame!);
        this.updateControls(this._elements.roundSpan, this._elements.winStreakSpan, this.session);
        this.updateGuessResult(this._elements.gameDiv, this.session.currentGame!);
        this.updateCharacters(this._elements.gameDiv, this.session.currentGame!);
    }

    connectedCallback() {
        this.innerHTML = `
        <style>
        .controls {
            display: flex;
            flex-direction: row;
            gap: 1rem;
            padding-bottom: 1rem;
        }
        
        .game {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
        }
        
        .game .guesses {
            display: grid;
            grid-template-columns: repeat(5, 2rem);
            grid-template-rows: repeat(5, 2rem);
            border: 1px solid black;
            border-radius: .2rem;
            padding: .2rem;
            gap: .2rem;
        }
        
        .game .characters {
            display: grid;
            gap: .2rem;
            grid-template-columns: repeat(13, 1.5rem);
            grid-template-rows: repeat(2, 1.5rem);
        }
        </style>

        <section>
            <div class="controls">
                <span>Round: <span id="round">1</span></span>
                <span>Streak: <span id="win-streak">0</span></span>   
                <button id="new-game">New Game</button>
            </div>
            
            <div class="game">
                <div class="guesses"></div>
                <div class="characters"></div>
            </div>
        </section>
        `;

        this._elements = {
            guessesDiv: this.querySelector('.guesses') as HTMLDivElement,
            charactersDiv: this.querySelector('.characters') as HTMLDivElement,
            roundSpan: this.querySelector('#round') as HTMLSpanElement,
            winStreakSpan: this.querySelector('#win-streak') as HTMLSpanElement,
            gameDiv: this.querySelector('.game') as HTMLDivElement,
            startBtn: this.querySelector('#new-game') as HTMLButtonElement
        };

        /**
         * Start new game when button clicked
         */
        this._elements.startBtn.addEventListener('click', () => {
            if(this.session === undefined || this._elements === undefined) {
                console.warn("Session or elements not initialized yet");
                return;
            }

            this.session.startNewGame();
            this._currentGuess = " ".repeat(5);
            this.updateCurrentGuess(this._elements.gameDiv, this.session.currentGame);
            this.updateControls(this._elements.roundSpan, this._elements.winStreakSpan, this.session);
            this.buildCleanGame(this._elements.guessesDiv, this._elements.charactersDiv, this.session.currentGame);
        });

        document.addEventListener('keydown', this._keydownHandler);
    }

    disconnectedCallback() {
        document.removeEventListener('keydown', this._keydownHandler);
    }

    /**
     * Builds the game grid and character list with empty boxes and fills in any previous guesses if the game is running
     */
    private buildCleanGame(guessesDiv: HTMLDivElement, charactersDiv: HTMLDivElement, game: Wordle) {
        guessesDiv.innerHTML = '';
        for(let i = 0; i < 5; i++) {
            const guess = new WordleGuess();
            guessesDiv.appendChild(guess);
            guess.index = i;
            guess.updateStatus(game, this._currentGuess);
        }

        charactersDiv.innerHTML = '';
        game.characters.forEach((character) => {
            const characterElem = new WordleCharacter();
            characterElem.character = character;
            charactersDiv.insertAdjacentElement('beforeend', characterElem);
        });
    }

    /**
     * Update the controls with the current round and win streak from the session
     */
    private updateControls(roundSpan: HTMLElement, winStreakSpan: HTMLElement, session: Session) {
        roundSpan.textContent = this.session.gamesPlayed.toString();
        winStreakSpan.textContent = this.session.winStreak.toString();
        console.log(session.currentGame?.word);
    }

    /**
     * Updates the current guess in the game grid with the characters typed by the player
     */
    private updateCurrentGuess(gameDiv: HTMLElement, game: Wordle) {
        const guesses = Array.from(gameDiv.querySelectorAll<WordleGuess>(`.guesses wordle-guess`));
        [...guesses].find(guess => guess.index === game.guesses.length)?.updateStatus(game, this._currentGuess);
    }

    /**
     * Updates the character list with the status of each character based on the previous guesses and the current game state
     */
    private updateCharacters(gameDiv: HTMLElement, game: Wordle) {
        const characterDivs = gameDiv.querySelectorAll<WordleCharacter>(`.characters wordle-character`);
        characterDivs.forEach((character) => {
            character.updateStatus(game);
        });
    }

    /**
     * Updates the game grid with the results of the previous guesses,
     * marking each character as correct, present, or absent based on the current game state
     */
    private updateGuessResult(gameDiv: HTMLElement, game: Wordle) {
        const guessDivs = gameDiv.querySelectorAll<WordleGuess>(`.guesses wordle-guess`);
        guessDivs.forEach(guessDiv => guessDiv.updateStatus(game, this._currentGuess));
    }

    keydownHandler(event: KeyboardEvent) {

        if(this.session === undefined || this.session.currentGame === undefined || this._elements === undefined) {
            console.warn("Session or elements not initialized yet");
            return;
        }

        if(this.session.currentGame.finished) return;

        if(event.key === "Enter") {
            try {
                this.session.currentGame.guessWord(this._currentGuess);
                this._currentGuess = " ".repeat(5);

                if(this.session.currentGame.won) {
                    alert("You won!");
                    this.updateControls(this._elements.roundSpan, this._elements.winStreakSpan, this.session);
                    this.session.updateLeaderboard();
                }

                else if (this.session.currentGame.finished) {
                    alert(`You lost! The word was: ${this.session.currentGame.word}`);
                    this.updateControls(this._elements.roundSpan, this._elements.winStreakSpan, this.session);
                }

                this.updateGuessResult(this._elements.gameDiv, this.session.currentGame);
                this.updateCharacters(this._elements.gameDiv, this.session.currentGame);
            }
            catch(e) {
                alert(e.message);
            }
        }
        if(event.key === "Backspace") {
            this._currentGuess = this._currentGuess.slice(0, -1);
            this.updateCurrentGuess(this._elements.gameDiv, this.session.currentGame);
        }

        if(event.key.length === 1 && event.key.match(/[a-z]/i)) {
            this._currentGuess += event.key.toLowerCase();
            this._currentGuess = this._currentGuess.padStart(6, " ").slice(1);
            this.updateCurrentGuess(this._elements.gameDiv, this.session.currentGame);
        }
    }

}

customElements.define('wordle-game', WordleGame);
