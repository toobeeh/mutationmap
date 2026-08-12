import { LitElement, css, html } from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {nativeStyles} from '../styles/native-styles.ts';
import type {Wordle} from '../../utils/wordle.ts';

@customElement('wordle-character')
export class WordleCharacter extends LitElement {

  @property({ attribute: false })
  state?: ReturnType<Wordle["characterStatus"]>;

  render() {
    return html`
      <div class="${this.state}">
        <slot></slot>
      </div>
    `;
  }

  static styles = [nativeStyles, css`
    :host {
      display: contents;
    }

    div {
      height: 2.5em;
      display: grid;
      place-content: center;
      aspect-ratio: 1;
      border-radius: .5em;
    }

    div.idle {
      background-color: var(--code-bg);
    }

    div.absent {
      background-color: rgba(252, 132, 150, 0.15);
    }

    div.present {
      background-color: var(--accent-bg);
    }

    div.correct {
      background-color: var(--accent-border);
    }
  `];
}

declare global {
  interface HTMLElementTagNameMap {
    'wordle-character': WordleCharacter;
  }
}
