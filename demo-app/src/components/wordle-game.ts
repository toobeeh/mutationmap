import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {nativeStyles} from '../styles/native-styles.ts';
import {Dictionary} from '../../utils/dictionary.ts';
import {Wordle} from '../../utils/wordle.ts';

@customElement('wordle-game')
export class WordleGame extends LitElement {

  private readonly _dictionary = new Dictionary();

  @property({attribute: false})
  private _game?: Wordle;

  private _startGame() {
    const words = [...this._dictionary.getWords().values()].filter(word => word.length === 5);
    this._game = new Wordle(new Set(words));
  }

  private _wordSubmitted() {
    this.requestUpdate();
    if(this._game?.won){
      alert("You won!");
    }
  }

  render() {
    return html`
      <header>
        <h1>MutationMap Wordle</h1>
      </header>
      <main>
        <wordle-dictionary .dictionary="${this._dictionary}" @dictionaryLoaded="${this._startGame}"></wordle-dictionary>
        <hr>

        <div class="guesses">
          ${
            this._game?.guesses.map(guess => html`
              <div class="guess">
                ${guess.split('').map((char, index) => html`
                    <wordle-log .state=${this._game.characterGuessStatus(char, index)}>${char}</wordle-log>
                `)}
              </div>
            `)
          }

          <wordle-input
            .game=${this._game}
            .remainingAttempts=${this._game?.remainingAttempts ?? 0}
            @wordSubmitted=${this._wordSubmitted}
          ></wordle-input>
        </div>
        <hr>

        <div class="characters">
          ${
            this._game?.characters.map(char => html`
              <wordle-character .state=${this._game.characterStatus(char)}>${char}</wordle-character>
            `)
          }
        </div>
      </main>

      <footer>
        <small>Test game for mutationmap debugger</small>
      </footer>
    `;
  }

  static styles = [nativeStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
      color: var(--text);
      padding: .5rem;
    }

    header, footer {
      text-align: center;
    }

    main {
      padding: 1rem;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .characters {
      width: fit-content;
      grid-gap: .5rem;
      display: grid;
      grid-template-columns: repeat(13, 1fr);
    }

    .guesses {
      display: flex;
      flex-direction: column;
      width: fit-content;
      gap: 1rem;
    }

    .guesses .guess {
      display: flex;
      flex-direction: row;
      width: fit-content;
      gap: .5rem;
    }
  `];
}

declare global {
  interface HTMLElementTagNameMap {
    'wordle-game': WordleGame
  }
}
