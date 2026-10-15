import {useContext} from "react";
import {SessionContext} from "../SessionContext.ts";
import "./Character.css";

export default function Character({character}:  {character: string}) {
    const session = useContext(SessionContext);

    if(session === null) {
        throw new Error("session unexpectedly null");
    }

    return (
        <span className={"game-character " + session.currentGame?.characterStatus(character)}>{character}</span>
    );
}
