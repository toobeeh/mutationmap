import {useContext, useEffect, useState} from "react";
import {SessionContext} from "../SessionContext.ts";
import Guess from "./Guess.tsx";
import Character from "./Character.tsx";
import "./Game.css";

export default function Game() {
    const session = useContext(SessionContext);

    if(session === null) {
        throw new Error("session unexpectedly null");
    }

    const [game, updateGame] = useState(session.currentGame ?? null);
    const [currentGuess, updateCurrentGuess] = useState(" ".repeat(5));
    const [characters, updateCharacters] = useState(session.currentGame?.characters ?? []);
    const [currentRound, updateCurrentRound] = useState(session.games.length);
    const [currentStreak, updateCurrentStreak] = useState(session.winStreak);
    const [guesses, updateGuesses] = useState(session.currentGame?.guesses ?? []);

    const startGame = () => {
        const game = session.startNewGame();
        console.log(game.word);

        updateCurrentRound(session.games.length);
        updateGuesses(game.guesses);
        updateCharacters([...game.characters]);
        updateGame(game);
    }

    /* listen to keydowns */
    useEffect(() => {

        if(session.currentGame === undefined) {
            startGame();
        }

        function handleKeyDown(event) {
            if(game === null || game.finished) return;

            /* word submitted */
            if(event.key === "Enter") {
                try {
                    game.guessWord(currentGuess);
                    updateCurrentGuess(" ".repeat(5));
                    updateGuesses([...game.guesses]); /* reactivity works on reference */
                    updateCharacters([...characters ?? []]);

                    if(game.won) {
                        alert("You won!");
                        updateCurrentStreak(session.winStreak);
                        session.updateLeaderboard();
                    }

                    else if (game.finished) {
                        alert(`You lost! The word was: ${game.word}`);
                        updateCurrentStreak(session.winStreak);
                    }
                }
                catch(e) {
                    alert((e as any).message);
                }
            }

            /* char deleted */
            if(event.key === "Backspace") {
                updateCurrentGuess(" ".repeat(5));
            }

            /* char entered */
            if(event.key.length === 1 && event.key.match(/[a-z]/i)) {
                let newGuess = currentGuess + event.key.toLowerCase();
                newGuess = newGuess.padStart(6, " ").slice(1);
                updateCurrentGuess(newGuess);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentGuess, characters, game]);

    return (
        <section>
            <div className="controls">
                <span>Round: <span id="round">{currentRound}</span></span>
                <span>Streak: <span id="win-streak">{currentStreak}</span></span>
                <button onClick={startGame} id="new-game">New Game</button>
            </div>

            <div className="game">
                <div className="guesses">

                    {
                        [...Array(5)].map((_, index) => (
                            <Guess currentGuess={currentGuess} guesses={guesses} index={index} key={index} />
                        ))
                    }

                </div>

                <div className="characters">

                    {
                        characters.map((char) => (
                            <Character character={char} key={char} />
                        ))
                    }

                </div>
            </div>
        </section>
    );
}
