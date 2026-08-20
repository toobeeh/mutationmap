<script lang="ts">
    import Router, {push} from "svelte-spa-router";
    import Login from "./lib/Login.svelte";
    import Leaderboard from "./lib/Leaderboard.svelte";
    import Game from "./lib/Game.svelte";
    import {Session} from "wordle-lib";
    import {session} from "./session.svelte";
    import wrap from "svelte-spa-router/wrap";

    /**
     * Check whether a session exists or restore a previous,
     * if not, redirect to the login page.
     */
    function hasSession(){

        /* previous session exists */
        if(sessionStorage.username !== undefined && session.current === undefined){
            const username = sessionStorage.username.trim();
            if(username.length > 0){
                session.current = new Session(username);
            }
        }

        /* redirect to login */
        if(session.current === undefined) {
            push("/");
            return false;
        }

        return true;
    }

    /* SPA app routing with guards */
    const routes = {
        "/": Login,
        "/leaderboard": wrap({
            component: Leaderboard,
            conditions: [hasSession]
        }),
        "/game": wrap({
            component: Game,
            conditions: [hasSession]
        })
    };
</script>

<style>
    #app {
        background: white;
        backdrop-filter: blur(20px);
        width: 50rem;
        height: 30rem;
        padding: 1rem;
        border-radius: .5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
    }
</style>

<div id="app">
    <header>
        <h1>Svelte Wordle</h1>
    </header>

    <nav>
        <a href="#/">Log In</a>
        <a href="#/leaderboard">Leaderboard</a>
        <a href="#/game">Play</a>
    </nav>

    <main>
        <Router {routes} />
    </main>

    <footer>
        <span>Mutation attribution evaluation @ svelte</span>
    </footer>
</div>
