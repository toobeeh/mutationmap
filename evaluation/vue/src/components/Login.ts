import {defineComponent, ref} from "vue";
import {state} from "../state.ts";
import {Session} from "wordle-lib";

export default defineComponent({
    setup() {
        const currentUsername = state.session?.username ?? sessionStorage.getItem("username") ?? "";
        const username = ref(currentUsername);

        return {
            username
        }
    },
    methods: {
        createSession() {
            const username = this.username.trim();
            if(username.length === 0) {
                alert("Please enter a username");
                return;
            }

            state.session = new Session(username);
            sessionStorage.setItem("username", username);
            console.log(state.session);
            this.$router.push("/game");
        }
    },
    template: `
      <section>
        <label for="username">Username</label>
        <input v-model="username" name="username" type="text">
        <button @click="createSession()" id="submit">Play</button>
      </section>
    `
})
