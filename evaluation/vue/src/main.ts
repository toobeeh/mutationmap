import {createApp} from 'vue'
import './style.css'
import App from './App.ts'
import Login from "./components/Login.ts";
import Leaderboard from "./components/Leaderboard.ts";
import Game from "./components/Game.ts";
import {createRouter, createWebHistory} from 'vue-router';
import {sessionGuard} from "./session-guard.ts";

const routes = [
    { path: '/', component: Login },
    { path: '/leaderboard', component: Leaderboard, beforeEnter: sessionGuard },
    { path: '/game', component: Game, beforeEnter: sessionGuard },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount('#app')
