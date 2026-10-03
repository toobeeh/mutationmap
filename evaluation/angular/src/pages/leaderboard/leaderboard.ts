import {Component, computed} from '@angular/core';
import {Session} from 'wordle-lib';
import {SessionService} from '../../service/session';

@Component({
  imports: [],
  selector: 'app-leaderboard',
  styleUrl: './leaderboard.scss',
  templateUrl: './leaderboard.html',
  standalone: true
})
export class Leaderboard {
  private readonly session: Session;

  constructor(private readonly sessionService: SessionService) {
    const session = this.sessionService.current();
    if(session === undefined) {
      throw new Error('No session found');
    }
    this.session = session;
  }

  protected get leaderboard() {
    return [...this.session.getLeaderboard().entries()].sort(([, a], [, b]) =>
      b.winStreak - a.winStreak || a.averageGuesses - b.averageGuesses
    );
  }

}
