import {defineComponent} from "vue";
import "./Character.css";
import {Wordle} from "wordle-lib";

export default defineComponent({
    props: {
        character: {
            type: String,
            required: true
        },
        game: {
            type: Wordle,
            required: false
        }
    },
    template: `
    <span class="list-character" :class="game?.characterStatus(character)">{{ character }}</span>
    `
});
