import {useContext} from "react";
import {SessionContext} from "../SessionContext.ts";
import "./Guess.css";

export default function Guess({index, guesses, currentGuess}: {index: number, guesses: string[], currentGuess: string}) {
    const session = useContext(SessionContext);

    if(session === null) {
        throw new Error("session unexpectedly null");
    }

    const isTyping = index === guesses.length;
    const isOldGuess = index < guesses.length;
    const paddedGuess = currentGuess.trim().padEnd(5, " ");

    return (
        <div className="guess">
            {
                [...Array(5)].map((_, charIndex) => {

                    if(isTyping) return <span key={charIndex} className="character current">{paddedGuess[charIndex] ?? ""}</span>;
                    if(isOldGuess) return <span key={charIndex} className={"character old " + session.currentGame?.characterGuessStatus(guesses[index][charIndex], charIndex)}>{guesses[index][charIndex] ?? ""}</span>;
                    return <span key={charIndex} className="character"></span>;
                })
            }
        </div>
    );
}
