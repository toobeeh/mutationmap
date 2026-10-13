import {defineComponent, computed} from "vue";
import "./Guess.css";
import {Wordle} from "wordle-lib";

export default defineComponent({
    props: {
        currentGuess: {
            type: String,
            required: true
        },
        guesses: {
            type: Array as () => string[],
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        game: {
            type: Wordle,
            required: false
        }
    },
    setup(props) {
        const isTyping = computed(() => props.index === props.guesses.length);
        const isOldGuess = computed(() => props.index < props.guesses.length);
        const paddedGuess = computed(() => props.currentGuess.padEnd(5, " "));

        return {
            isTyping,
            isOldGuess,
            paddedGuess
        };
    },
    template: `
      <div class="guess">
        <template v-for="charIndex in 5" :key="charIndex">
          
          <span v-if="isTyping" class="character current">{{paddedGuess[charIndex - 1] ?? ""}}</span>
          
          <span v-else-if="isOldGuess" class="character old" :class="game?.characterGuessStatus(guesses[index][charIndex - 1], charIndex - 1)">
            {{guesses[index][charIndex - 1]}}
          </span>
          
          <span v-else class="character"></span>
          
        </template>
      </div>
    `
});
