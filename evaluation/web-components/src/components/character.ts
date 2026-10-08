import type {Wordle} from "wordle-lib";

export class WordleCharacter extends HTMLElement {

    private characterDiv?: HTMLDivElement;
    private _character: string = " ";

    public set character(character: string) {
        this._character = character;
        if(this.characterDiv !== undefined) {
            this.characterDiv.innerHTML = character;
        }
    }

    public updateStatus(game: Wordle) {
        if(this.characterDiv !== undefined) {
            const state = game.characterStatus(this._character);
            this.characterDiv.classList.remove("idle", "present", "correct", "absent");
            this.characterDiv.classList.add(state);
        }
    }

    connectedCallback() {
        this.innerHTML = `
        <style>
            .character {
                aspect-ratio: 1 / 1;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: .2rem;
                background: #ededed;
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

        <div class="character">${this._character}</div>`
        ;

        this.characterDiv = this.querySelector('.character') as HTMLDivElement;
    }
}

customElements.define('wordle-character', WordleCharacter);
