<script lang="ts">

    import {session} from "../session.svelte";

    const game = $derived(session.current?.currentGame);
    let {character = " "}: {character: string} = $props();

</script>

<style>

    .character {
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: .2rem;
        background: #ededed;
    }

    .character.correct {
        background: #d6ebc8;
    }

    .character.absent {
        background: #ebc8c8;
    }

    .character.present {
        background: #b9caff;
    }
</style>

<span class="character {game?.characterStatus(character)}">{character}</span>
