import { LitElement, css, html } from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {nativeStyles} from '../styles/native-styles.ts';
import type {Wordle} from '../../utils/wordle.ts';

@customElement('wordle-input')
export class WordleInput extends LitElement {

  private readonly _keydownListener = this.handleKeydown.bind(this);

  @property({ attribute: false })
  private _input = "";

  @property({ attribute: false })
  game?: Wordle;

  @property({ attribute: false })
  remainingAttempts = 0;

  connectedCallback() {
    super.connectedCallback();
    document.body.addEventListener('keydown', this._keydownListener);
  }

  render() {

    const rowChars = " ".repeat(this.game?.wordLength ?? 0).split("");
    const remainingAttempts = " ".repeat(this.remainingAttempts - 1).split("");

    return html`
      <div class="attempt">
        ${
          this.remainingAttempts !== 0 ? rowChars.map((_, index) => html`
              <wordle-log .state="${(this.game?.finished === true) ? "idle" : (this._input[index] ? 'correct' : 'present')}">
                ${this._input[index] ?? " "}
              </wordle-log>
          `) : ""
        }
      </div>
      ${
        remainingAttempts.map(() => html`
          <div class="attempt">${
            rowChars.map(() => html`
              <wordle-log .state=${"idle"}> </wordle-log>
          `)
        }`)
      }
    `;
  }

  handleKeydown(event: KeyboardEvent) {
    const key = event.key;
    const character = key.length === 1 ? key : '';

    if (character && this.game && this.game.characters.includes(character)) {

      let input = this._input + character;
      if(input.length > this.game.wordLength) {
        input = input.substring(1, this.game.wordLength + 1);
      }

      this._input = input;
    }
    else if(key === "Backspace" && this._input.length > 0) {
      this._input = this._input.substring(0, this._input.length - 1);
    }
    else if(key === "Enter" && this.game) {
      try {
        this.game.guessWord(this._input);
        this._input = "";

        this.dispatchEvent(new CustomEvent('wordSubmitted'));
      } catch (error) {
        console.error(error);
        alert((error as any).message);
        this._input = "";
      }
    }
  }

  disconnectedCallback() {
    document.body.removeEventListener('keydown', this.handleKeydown);
    super.disconnectedCallback();
  }

  static styles = [nativeStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      width: fit-content;
      gap: 1rem;
    }

    .attempt {
      display: flex;
      flex-direction: row;
      width: fit-content;
      gap: .5rem;
    }
  `];
}

declare global {
  interface HTMLElementTagNameMap {
    'wordle-input': WordleInput;
  }
}
