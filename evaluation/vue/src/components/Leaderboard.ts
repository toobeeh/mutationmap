import {defineComponent} from "vue";
import {state} from "../state.ts";
import "./Leaderboard.css";

export default defineComponent({
    setup() {
        const session = state.session;
        const leaderboard = [
            ...(session?.getLeaderboard().entries() ?? [])
        ].sort(([, a], [, b]) =>
            b.winStreak - a.winStreak || a.averageGuesses - b.averageGuesses
        );

        return {
            leaderboard
        };
    },
    methods: {
        update() {
        }
    },
    template: `
      <section>
        <p v-if="leaderboard.length === 0">Be the frst in the leaderboard!</p>
        <div v-else class="leaderboard">
          <div v-for="([username, result], index) in leaderboard" class="rank">
            <span class="place">#{{index + 1}}</span>
            <span class="username">{{ username }}</span>
            <span class="streak">Streak: {{ result.winStreak }}</span>
            <span class="average">Avg. Guesses: {{ result.averageGuesses.toFixed(2) }}</span>
          </div>
        </div>
      </section>`
})
