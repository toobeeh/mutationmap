import {Component, Input, signal} from '@angular/core';
import {Wordle} from 'wordle-lib';
import {SessionService} from '../../service/session';

@Component({
  imports: [],
  selector: 'app-character',
  styleUrl: './character.scss',
  templateUrl: './character.html',
})
export class Character {
  protected readonly game: Wordle;
  protected readonly state = signal("");

  constructor(private readonly session: SessionService) {
    const game = this.session.current().currentGame;
    if(game === undefined) {
      throw new Error('No game found');
    }
    this.game = game;
  }

  @Input() character: string = " ";

  @Input() set guesses(guesses: string[]) {
    this.state.update(() => this.game.characterStatus(this.character));
  }

}
