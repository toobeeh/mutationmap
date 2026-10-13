import {reactive} from "vue";
import {Session} from "wordle-lib";

export const state = reactive({
    session: null as Session | null,
});
