import {Session} from "wordle-lib";

export function renderLanding(session: Session | undefined, main: HTMLElement, sessionChanged: (session) => void) {

    main.innerHTML = `
        <section>
            <h2>Log in</h2>
            <label for="username">Username</label>
            <input name="username" type="text">
            <button id="submit">Play</button>
        </section>
    `;

    const button = main.querySelector('#submit');
    const input = main.querySelector('input[name="username"]') as HTMLInputElement;

    input.value = session?.username ?? "";

    button.addEventListener('click', () => {
        const username = input.value.trim();
        if(username.length === 0) {
            alert("Please enter a username.");
            return;
        }
        sessionStorage.username = username;
        const newSession = new Session(username);
        newSession.startNewGame();

        sessionChanged(newSession);
    });
}
