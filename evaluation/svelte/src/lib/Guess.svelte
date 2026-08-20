<script lang="ts">

    import {session} from "../session.svelte";

    let {
        currentGuess = " ".repeat(5),
        guesses = [],
        index = 0
    }: {
        currentGuess: string,
        guesses: Array<string>,
        index: number
    } = $props();

    const game = session.current?.currentGame;

    const isTyping = $derived(index === (guesses.length ?? 0));
    const isOldGuess = $derived(index < (guesses.length ?? 0));

    const paddedGuess = $derived(currentGuess.trim().padEnd(5, " "));
</script>

<style>

    .guess {
        display: contents;
    }

    .guess .character {
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ededed;
        border-radius: .2rem;
    }

    .guess .character.old {
        background: #c8d4eb;
    }

    .guess .character.current {
        background: #d2ebc8;
    }

    .guess .character.correct {
        background: #d6ebc8;
    }

    .guess .character.absent {
        background: #ebc8c8;
    }

    .guess .character.present {
        background: #b9caff;
    }

    .guess .character:empty::before {
        content: " ";
    }

</style>

<div class="guess">
    {#each {length: 5} as _, charIndex}

        {#if isTyping}
            <span class="character current">{paddedGuess[charIndex] ?? ""}</span>
        {:else if (isOldGuess)}
            <span class="character old {game?.characterGuessStatus(guesses[index][charIndex], charIndex)}">{guesses[index][charIndex] ?? ""}</span>
        {:else}
            <span class="character"></span>
        {/if}

    {/each}
</div>

