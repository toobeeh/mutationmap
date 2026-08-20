<script lang="ts">
    import {session} from "../session.svelte";
    import {Session} from "wordle-lib";
    import {push} from "svelte-spa-router";

    let username = session.current?.username ?? "";

    /**
     * Creates a new session with the provided username and navigates to the game page.
     * If the username is empty, an alert is shown to the user.
     */
    function createSession() {
        username = username.trim();
        if(username.length === 0) {
            alert("Please enter a username");
            return;
        }

        session.current = new Session(username);
        sessionStorage.setItem("username", username);
        console.log(session.current);
        push("/game");
    }

</script>

<section>
    <label for="username">Username</label>
    <input bind:value="{username}" name="username" type="text">
    <button on:click={createSession} id="submit">Play</button>
</section>
