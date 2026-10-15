import {SessionContext} from "../SessionContext.ts";
import {useContext, useState} from "react";
import {Session} from "wordle-lib";

export default function Login({submitSession}: {submitSession: (s: Session) => void}) {

    const session = useContext(SessionContext);
    let initialUsername = session?.username ?? sessionStorage.getItem("username") ?? "";
    const [input, setInput] = useState(initialUsername);

    /**
     * Creates a new session with the provided username.
     * If the username is empty, an alert is shown to the user.
     */
    function createSession() {
        const username = input.trim();
        if(username.length === 0) {
            alert("Please enter a username");
            return;
        }

        const newSession = new Session(username);
        sessionStorage.setItem("username", username);
        console.log(newSession);
        submitSession(newSession);
    }

    return (
        <section>
            <label htmlFor="username">Username</label>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                name="username"
                type="text"
            />
            <button onClick={createSession} id="submit">Play</button>
        </section>
    );
}
