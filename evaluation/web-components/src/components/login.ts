import {EventEmitter} from "../eventEmitter.ts";
import {Session} from "wordle-lib";

export class WordleLogin extends HTMLElement {

    private readonly loggedInEvent = new EventEmitter<Session>();
    public readonly onLoggedIn = this.loggedInEvent.readonlyEmitter;

    public set session(session: Session | undefined) {
        const input = this.querySelector('input[name="username"]') as HTMLInputElement;
        input.value = session?.username ?? "";
    }

    connectedCallback() {
        this.innerHTML = `
        <section>
            <label for="username">Username</label>
            <input name="username" type="text">
            <button id="submit">Play</button>
        </section>
        `;

        const button = this.querySelector('#submit');
        const input = this.querySelector('input[name="username"]') as HTMLInputElement;

        /* init session on name enter */
        button.addEventListener('click', () => {
            const username = input.value.trim();
            if(username.length === 0) {
                alert("Please enter a username.");
                return;
            }
            sessionStorage.username = username;
            const newSession = new Session(username);
            newSession.startNewGame();

            this.loggedInEvent.emit(newSession);
            window.location.hash = "/play";
        });
    }
}

customElements.define('wordle-login', WordleLogin);
