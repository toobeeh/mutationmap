<script lang="ts">
    import {session} from "../session.svelte";

    /**
     * ordered leaderboard by win streak and average guesses
     * reactive to session changes, not leaderboard changes
     */
    const leaderboard = $derived([
            ...(session.current?.getLeaderboard().entries() ?? [])
        ].sort(([, a], [, b]) =>
            b.winStreak - a.winStreak || a.averageGuesses - b.averageGuesses
        )
    );

</script>

<style>
    .leaderboard{
        display: grid;
        grid-template-columns: auto auto auto auto;
        align-items: center;
        justify-content: center;
        row-gap: 1rem;
        column-gap: 1rem;
    }

    .rank {
        display: contents;
    }

    .rank .place {
        font-size: 1.2em;
        opacity: .9;
    }

    .rank .username {
        display: flex;
        align-items: center;
        font-weight: bold;
    }

    .rank .username:before {
        content: "👤";
        padding-right: .5rem;
    }

    .rank :is(.streak, .average) {
        opacity: .9;
        font-style: italic;
    }
</style>

<section>
    {#if (leaderboard.length === 0)}
        <p>Be the frst in the leaderboard!</p>
    {:else}
        <div class="leaderboard">
            {#each leaderboard as [username, result], index}
                <div class="rank">
                    <span class="place">#{index + 1}</span>
                    <span class="username">{username}</span>
                    <span class="streak">Streak: {result.winStreak}</span>
                    <span class="average">Avg. Guesses: {result.averageGuesses.toFixed(2)}</span>
                </div>
            {/each}
        </div>
    {/if}
</section>
