import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {SessionService} from '../service/session';

export const authGuard: CanActivateFn = (route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  /* previous session exists */
  const username = sessionStorage.getItem("username");
  if(username !== null && session.current() === undefined){
    const username = sessionStorage.getItem("username").trim();
    if(username.length > 0){
      session.create(username);
    }
  }

  /* redirect to login */
  if(session.current() === undefined) {
    return router.parseUrl('/');
  }

  return true;
};
