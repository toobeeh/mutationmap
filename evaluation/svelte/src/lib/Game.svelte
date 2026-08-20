<script lang="ts">

    import {session} from "../session.svelte";
    import Guess from "./Guess.svelte";
    import Character from "./Character.svelte";

    let game = $derived(session.current?.currentGame);
    let currentGuess = $state(" ".repeat(5));
    let characters = $derived(game?.characters);

    /* reactivity ONLY for session! */
    let currentRound = $derived(session.current?.games.length ?? 0);
    let currentStreak = $derived(session.current?.winStreak ?? 0);
    let guesses = $derived(session.current?.currentGame?.guesses ?? []);

    const startGame = function(){
        game = session.current?.startNewGame();
        console.log(game?.word);
        currentRound = session.current?.games.length ?? 0;
        guesses = [];
        characters = [...characters ?? []];
    }

    if(game === undefined) {
        startGame();
    }

    /**
     * Keyboard listener for the game. Handles user input for guessing words.
     * @param event
     */
    const keyboardListener = function(event: KeyboardEvent) {

        if(game === undefined || game.finished) return;

        /* word submitted */
        if(event.key === "Enter") {
            try {
                game.guessWord(currentGuess);
                currentGuess = " ".repeat(5);
                guesses = [...game.guesses]; /* reactivity works on reference */
                characters = [...characters ?? []];

                if(game.won) {
                    alert("You won!");
                    currentStreak = session.current?.winStreak ?? 0;
                    session.current?.updateLeaderboard();
                }

                else if (game.finished) {
                    alert(`You lost! The word was: ${game.word}`);
                    currentStreak = session.current?.winStreak ?? 0;
                }
            }
            catch(e) {
                alert((e as any).message);
            }
        }

        /* char deleted */
        if(event.key === "Backspace") {
            currentGuess = currentGuess.slice(0, -1);
        }

        /* char entered */
        if(event.key.length === 1 && event.key.match(/[a-z]/i)) {
            currentGuess += event.key.toLowerCase();
            currentGuess = currentGuess.padStart(6, " ").slice(1);
        }
    }

</script>

<svelte:window onkeydown={keyboardListener} />

<style>
    .controls {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        padding-bottom: 1rem;
    }

    .game {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
    }

    .game .guesses {
        display: grid;
        grid-template-columns: repeat(5, 2rem);
        grid-template-rows: repeat(5, 2rem);
        border: 1px solid black;
        border-radius: .2rem;
        padding: .2rem;
        gap: .2rem;
    }

    .game .characters {
        display: grid;
        gap: .2rem;
        grid-template-columns: repeat(13, 1.5rem);
        grid-template-rows: repeat(2, 1.5rem);
    }
</style>

<section>
    <div class="controls">
        <span>Round: <span id="round">{currentRound}</span></span>
        <span>Streak: <span id="win-streak">{currentStreak}</span></span>
        <button onclick={startGame} id="new-game">New Game</button>
    </div>

    <div class="game">
        <div class="guesses">

            {#each {length: 5} as _, index}
                <Guess currentGuess={currentGuess} index={index} guesses={guesses} />
            {/each}

        </div>

        <div class="characters">
            {#key characters}
                {#each characters ?? [] as char}
                    <Character character={char} />
                {/each}
            {/key}
        </div>
    </div>
</section>

