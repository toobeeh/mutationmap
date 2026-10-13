import {defineComponent, ref} from "vue";
import "./Game.css";
import {state} from "../state.ts";
import Guess from "./Guess";
import Character from "./Character";

export default defineComponent({
    setup() {

        if(state.session === null) {
            throw new Error("No session found. Please log in first.");
        }

        const game = ref(state.session.currentGame);
        const currentGuess = ref(" ".repeat(5));
        const characters = ref(game.value?.characters);
        const currentRound = ref(state.session?.games.length ?? 0);
        const currentStreak = ref(state.session?.winStreak ?? 0);
        const guesses = ref(game?.value?.guesses ?? []);

        return {
            currentRound,
            currentStreak,
            currentGuess,
            characters,
            guesses,
            game
        };
    },
    components: {
        Guess,
        Character
    },
    mounted() {
        if(this.game === undefined){
            this.startGame();
        }
        document.addEventListener('keydown', this.keyboardListener)
    },
    unmounted() {
        document.removeEventListener('keydown', this.keyboardListener);
    },
    methods: {
        startGame() {
            this.game = state.session?.startNewGame();
            console.log(this.game?.word);
            this.currentRound = state.session?.games.length ?? 0;
            this.guesses = [];
            this.characters = [...this.game?.characters ?? []];
        },
        keyboardListener(event: KeyboardEvent) {
            if(this.game === undefined || this.game.finished) return;

            /* word submitted */
            if(event.key === "Enter") {
                try {
                    this.game.guessWord(this.currentGuess);
                    this.currentGuess = " ".repeat(5);
                    this.guesses = [...this.game.guesses]; /* reactivity works on reference */
                    this.characters = [...this.characters ?? []];

                    if(this.game.won) {
                        alert("You won!");
                        this.currentStreak = state.session?.winStreak ?? 0;
                        state.session?.updateLeaderboard();
                    }

                    else if (this.game.finished) {
                        alert(`You lost! The word was: ${this.game.word}`);
                        this.currentStreak = state.session?.winStreak ?? 0;
                    }
                }
                catch(e) {
                    alert((e as any).message);
                }
            }

            /* char deleted */
            if(event.key === "Backspace") {
                this.currentGuess = this.currentGuess.slice(0, -1);
            }

            /* char entered */
            if(event.key.length === 1 && event.key.match(/[a-z]/i)) {
                this.currentGuess += event.key.toLowerCase();
                this.currentGuess = this.currentGuess.padStart(6, " ").slice(1);
            }
        }
    },
    template: `
      <section>
        <div class="controls">
          <span>Round: <span id="round">{{ currentRound }}</span></span>
          <span>Streak: <span id="win-streak">{{ currentStreak }}</span></span>
          <button @click=startGame id="new-game">New Game</button>
        </div>

        <div class="game">
          <div class="guesses">            
            <Guess v-for="index in 5" :key="index" :currentGuess="currentGuess" :index="index - 1" :guesses="guesses" :game="game" />
          </div>

          <div class="characters">
            <Character
                v-for="(char, index) in (characters ?? [])"
                :key="index"
                :character="char"
                :game="game"
            />
          </div>
        </div>
      </section>
    `
});
