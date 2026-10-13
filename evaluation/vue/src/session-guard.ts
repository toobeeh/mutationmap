import {state} from "./state";
import {Session} from "wordle-lib";
import type {NavigationGuard} from 'vue-router';

export const sessionGuard: NavigationGuard = () => {
    const session = state.session;

    if(session === null) {

        const lastUsername = sessionStorage.getItem("username");
        if(lastUsername !== null) {
            state.session = new Session(lastUsername);
            return true;
        }

        return { name: "/" };
    }

    return true;
};
