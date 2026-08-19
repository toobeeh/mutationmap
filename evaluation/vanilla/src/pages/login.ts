import {Session} from "wordle-lib";

export function renderLogin(session: Session | undefined, main: HTMLElement, sessionChanged: (session) => void) {

    main.innerHTML = `
        <section>
            <label for="username">Username</label>
            <input name="username" type="text">
            <button id="submit">Play</button>
        </section>
    `;

    /* get template elements */
    const button = main.querySelector('#submit');
    const input = main.querySelector('input[name="username"]') as HTMLInputElement;

    /* default to current name */
    input.value = session?.username ?? "";

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

        sessionChanged(newSession);
    });
}
