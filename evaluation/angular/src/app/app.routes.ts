import { Routes } from '@angular/router';
import {Game} from '../pages/game/game';
import {Login} from '../pages/login/login';
import {Leaderboard} from '../pages/leaderboard/leaderboard';
import {authGuard} from '../guards/auth-guard';

export const routes: Routes = [
  {
    path: "",
    component: Login,
  },
  {
    path: "game",
    component: Game,
    canActivate: [authGuard]
  },
  {
    path: "leaderboard",
    component: Leaderboard,
    canActivate: [authGuard]
  }
];
