import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {SessionService} from '../../service/session';

@Component({
  imports: [],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
  standalone: true
})
export class Login {

  private readonly router = inject(Router);
  protected readonly session = inject(SessionService);

  public createSession(username: string) {

    username = username.trim();
    if(username.length === 0) {
      alert("Please enter a username");
      return;
    }

    this.session.create(username);
    sessionStorage.setItem('username', username);
    this.router.navigate(['/game']);
  }
}
