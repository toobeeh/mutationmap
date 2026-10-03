import {Component, computed, Input, Signal} from '@angular/core';
import {Wordle} from 'wordle-lib';
import {SessionService} from '../../service/session';

@Component({
  imports: [],
  selector: 'app-guess',
  styleUrl: './guess.scss',
  templateUrl: './guess.html',
  standalone: true
})
export class Guess {
  protected readonly game: Wordle;

  constructor(private readonly session: SessionService) {
    const game = this.session.current().currentGame;
    if(game === undefined) {
      throw new Error('No game found');
    }
    this.game = game;
  }

  @Input() currentGuess: Signal<string>;
  @Input() guesses: Signal<string[]>;
  @Input() index: number = 0;

  protected isTyping = computed(() => this.index === this.guesses().length);
  protected isOldGuess = computed(() => this.index < this.guesses().length);
  protected paddedGuess = computed(() => this.currentGuess().trim().padEnd(5, " "));

}
