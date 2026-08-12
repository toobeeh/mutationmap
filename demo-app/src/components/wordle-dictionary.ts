import { LitElement, css, html } from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {nativeStyles} from '../styles/native-styles.ts';
import {Dictionary} from '../../utils/dictionary.ts';
import {createRef, ref} from 'lit/directives/ref.js';

@customElement('wordle-dictionary')
export class WordleDictionary extends LitElement {

  @property({ attribute: false })
  dictionary?: Dictionary;

  @property({ attribute: false })
  private _wordCount = 0;

  urlInput = createRef<HTMLInputElement>();

  private async _onClick() {
    if(this.dictionary === undefined){
      throw new Error("Dictionary is undefined");
    }

    this.dictionary.source = this.urlInput.value?.value ?? "";
    await this.dictionary.load();
    this._wordCount = this.dictionary.getWords().size;
    console.log("Loaded dictionary with words:", this.dictionary.getWords());

    this.dispatchEvent(new CustomEvent('dictionaryLoaded'));
  }

  render() {
    return html`
      <input
        value="https://raw.githubusercontent.com/Are-You-a-Person/skribbl-word-bank/refs/heads/main/skribbl_words_alphabetical_en.txt"
        placeholder="Url to word list, one word per line" type="text" ${ref(this.urlInput)}
      />
      <button @click=${this._onClick}>Load & Play</button>
      <small>${this._wordCount} words</small>
    `;
  }

  static styles = [nativeStyles, css`
    :host {
      display: grid;
      grid-template-columns: 3fr 1fr auto;
      gap: 1em;
      align-items: center;
    }
  `];
}

declare global {
  interface HTMLElementTagNameMap {
    'wordle-dictionary': WordleDictionary;
  }
}
