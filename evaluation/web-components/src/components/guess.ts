import type {Wordle} from "wordle-lib";

export class WordleGuess extends HTMLElement {

    private _guessDiv?: HTMLDivElement;
    private _index: number = -1;

    public set index(index: number) {
        this._index = index;
    }

    public get index() {
        return this._index;
    }

    public updateStatus(game: Wordle, currentGuess: string) {
        if(this._guessDiv !== undefined && this._index !== -1) {
            this._guessDiv.innerHTML = '';
            this.classList.toggle('old', false);
            this.classList.toggle('current', false);

            /* if guess has been submitted */
            if(this.index < game.guesses.length) {
                this.classList.add('old');
                const guess = game.guesses[this.index];
                for(let i = 0; i < 5; i++) {
                    const char = guess[i] ?? " ";
                    const state = game.characterGuessStatus(char, i);
                    this._guessDiv.insertAdjacentHTML('beforeend', `<span class="character ${state}">${char}</span>`);
                }
            }
            /* if currently typing */
            else if(game.guesses.length === this.index) {
                let padded = currentGuess.trim().padEnd(5, " ");
                this.classList.add('current');
                for(let i = 0; i < 5; i++) {
                    const char = padded[i] ?? " ";
                    this._guessDiv.insertAdjacentHTML('beforeend', `<span class="character">${char}</span>`);
                }
            }
            /* if blank */
            else {
                for(let i = 0; i < 5; i++) {
                    this._guessDiv.insertAdjacentHTML('beforeend', `<span class="character"></span>`);
                }
            }
        }
    }

    connectedCallback() {

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
        <style>
        
            :host {
                display: contents;
            }
            
            .guess {
                display: contents;
            }
        
            .character {
                aspect-ratio: 1 / 1;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #ededed;
                border-radius: .2rem;
            }
            
            .guess.old .character {
                background: #c8d4eb;
            }
            
            .guess.current .character {
                background: #d2ebc8;
            }
            
            .character.correct {
                background: #d6ebc8;
            }
            
            .character.absent {
                background: #ebc8c8;
            }
            
            .character.present {
                background: #b9caff;
            }
        </style>

        <div class="guess"></div>`
        ;

        this._guessDiv = this.shadowRoot.querySelector('.guess') as HTMLDivElement;
    }
}

customElements.define('wordle-guess', WordleGuess);
