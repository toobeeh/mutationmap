import './style.css';
import {Session} from "wordle-lib";
import {renderLanding} from "./pages/landing.ts";
import {renderLeaderboard} from "./pages/leaderboard.ts";
import {renderGame} from "./pages/game.ts";


document.getElementById("app").innerHTML = `
<header>
    <h1>Vanilla Wordle</h1>
</header>

<nav>
    <a href="#home">Log In</a>
    <a href="#leaderboard">Leaderboard</a>
    <a href="#play">Play</a>
</nav>

<main></main>

<footer>
    <span>Mutation attribution demo @ vanilla</span>
</footer>
`;

let session: Session | undefined = undefined;

if(sessionStorage.username?.length > 0) {
    session = new Session(sessionStorage.username);
    session.startNewGame();
}

let abortController = new AbortController();
const main = document.querySelector('main');

/* primitive routing with guards */
window.addEventListener('hashchange', () => {
    renderSection();
});

/* render home as default section */
renderSection();

/**
 * Renders the section of the app based on the current hash in the URL or a forced section.
 * @param forceSection
 */
function renderSection(forceSection?: string) {
    const section = forceSection ?? window.location.hash.substring(1);
    switch (section) {

        case 'home':
            abortController.abort();
            abortController = new AbortController();
            renderLanding(session, main, (newSession) => {
                session = newSession;
                window.location.hash = 'play';
            });
            break;

        case 'leaderboard':
            if(session === undefined) {
                window.location.hash = 'home';
                alert("Log in before viewing the leaderboard.");
            }
            abortController.abort();
            abortController = new AbortController();
            renderLeaderboard(session, main);
            break;

        case 'play':
            if(session === undefined) {
                window.location.hash = 'home';
                alert("Log in before playing.");
            }
            abortController.abort();
            abortController = new AbortController();
            renderGame(session, main, abortController.signal);
            break;
    }
}
