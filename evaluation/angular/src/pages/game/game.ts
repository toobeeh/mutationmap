import {Component, computed, signal} from '@angular/core';
import {SessionService} from '../../service/session';
import {Session, Wordle} from 'wordle-lib';
import {Guess} from '../../components/guess/guess';
import {Character} from '../../components/character/character';

@Component({
  imports: [
    Guess,
    Character
  ],
  selector: 'app-game',
  styleUrl: './game.scss',
  templateUrl: './game.html',
  standalone: true,
  host: {
    "(document:keydown)": "onKeyDown($event)"
  }
})
export class Game {

  private readonly session: Session;

  protected readonly currentRound = signal(0);
  protected readonly currentStreak = signal(0);
  protected readonly currentGuess = signal(" ".repeat(5));
  protected readonly guesses = signal([] as string[]);
  protected readonly game = signal<Wordle | undefined>(undefined);
  protected readonly characters = signal([] as string[]);

  constructor(private readonly sessionService: SessionService) {
    const session = this.sessionService.current();
    if(session === undefined) {
      throw new Error('No session found');
    }
    this.session = session;

    if(session.currentGame === undefined) {
      this.startGame();
    }
  }

  public startGame() {
    const game = this.session.startNewGame();
    this.game.update(() => game);
    console.log(game.word);
    this.currentRound.update(() => this.session.games.length);
    this.guesses.update(() => []);
    this.currentStreak.update(() => this.session.winStreak);
    this.characters.update(() => [...game.characters]);
  }

  protected onKeyDown(event: KeyboardEvent) {

    const game = this.game();

    if(game === undefined || game.finished) {
      return;
    }
    /* word submitted */
    if(event.key === "Enter") {
      try {
        game.guessWord(this.currentGuess());
        this.currentGuess.update(() => " ".repeat(5));
        this.guesses.update(() => [...game.guesses]);
        this.characters.update(() => [...game.characters]);

        if(game.won) {
          alert("You won!");
          this.currentStreak.update(() => this.session.winStreak);
          this.session.updateLeaderboard();
        }

        else if (game.finished) {
          alert(`You lost! The word was: ${game.word}`);
          this.currentStreak.update(() => this.session.winStreak);
        }
      }
      catch(e) {
        alert((e as any).message);
      }
    }

    /* char deleted */
    if(event.key === "Backspace") {
      this.currentGuess.update(val => val.slice(0, -1));
    }

    /* char entered */
    if(event.key.length === 1 && event.key.match(/[a-z]/i)) {
      this.currentGuess.update(val => {
        val += event.key.toLowerCase();
        return val.padStart(6, " ").slice(1);
      });
    }
  }
}
