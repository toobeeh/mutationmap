import {createContext} from "react";
import {Session} from "wordle-lib";

export const SessionContext = createContext<Session | null>(null);
