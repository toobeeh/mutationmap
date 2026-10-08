import {Session} from "wordle-lib";
import {Router} from "./router.ts";
import {WordleLogin} from "./components/login.ts";
import {WordleGame} from "./components/game.ts";
import {WordleLeaderboard} from "./components/leaderboard.ts";

export class WordleApp extends HTMLElement {

    private session?: Session;
    private router = new Router();

    connectedCallback() {

        /* resume session */
        if(sessionStorage.username?.length > 0) {
            this.session = new Session(sessionStorage.username);
            this.session.startNewGame();
        }

        this.innerHTML = `
        <div id="app">
            <header>
                <h1>Web Components Wordle</h1>
            </header>
            
            <nav>
                <a href="#/login">Log In</a>
                <a href="#/leaderboard">Leaderboard</a>
                <a href="#/play">Play</a>
            </nav>
            
            <main></main>
            
            <footer>
                <span>Mutation attribution evaluation @ web components</span>
            </footer>
        </div>`;

        const outlet = this.querySelector("main") as HTMLElement;

        this.router.addRoute({
            path: "/",
            guard: () => "/login"
        });

        this.router.addRoute({
            path: "/play",
            component: "wordle-game",
            guard: () => this.session !== undefined ? true : "/login"
        });

        this.router.addRoute({
            path: "/login",
            component: "wordle-login",
            guard: () => true
        });

        this.router.addRoute({
            path: "/leaderboard",
            component: "wordle-leaderboard",
            guard: () => this.session !== undefined ? true : "/login"
        });

        this.router.onRouted.subscribe(route => {
            console.log(`Navigated to ${route}`);
            outlet.innerHTML = "";
            const component = document.createElement(route);
            outlet.appendChild(component);

            if(component instanceof WordleLogin) {
                component.session = this.session;
                component.onLoggedIn.subscribe(session => this.session = session);
            }

            if(component instanceof WordleGame){
                component.session = this.session;
            }

            if(component instanceof WordleLeaderboard){
                component.session = this.session;
            }
        })

        this.router.observe();
    }
}

customElements.define('wordle-app', WordleApp)
