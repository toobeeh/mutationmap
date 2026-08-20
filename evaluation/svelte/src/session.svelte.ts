import {Session} from "wordle-lib";

export const session = $state<{current: Session | undefined}>({
    current: undefined
});
