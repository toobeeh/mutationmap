import {Session} from "wordle-lib";
import "./game.css";

export function renderGame(session: Session, main: HTMLElement, destroy: AbortSignal) {

    main.innerHTML = `
<section>
    <h2>Game</h2>
    
    <div class="controls">
        <span>Round <span id="round">1</span></span>
        <span>Win-streak <span id="win-streak">0</span></span>   
        <button id="new-game">New Game</button>
    </div>
    
    <div class="game">
        <div class="guesses"></div>
        <div class="characters"></div>
    </div>

</section>
    `;

    const startBtn = main.querySelector('#new-game') as HTMLButtonElement;
    const roundSpan = main.querySelector('#round') as HTMLSpanElement;
    const winStreakSpan = main.querySelector('#win-streak') as HTMLSpanElement;
    const gameDiv = main.querySelector('.game');
    const charactersDiv = main.querySelector('.characters');
    const guessesDiv = main.querySelector('.guesses');

    let game = session.currentGame;
    let currentGuess = " ".repeat(5);

    function buildCleanGame() {
        guessesDiv.innerHTML = '';
        for(let i = 0; i < 5; i++) {
            let wordBoxes = "<span class='character'></span>".repeat(5);
            guessesDiv.insertAdjacentHTML('beforeend', `<div class="guess"">${wordBoxes}</div>`);
        }

        charactersDiv.innerHTML = '';
        game.characters.forEach((character) => {
            charactersDiv.insertAdjacentHTML('beforeend', `<span class="character" data-character="${character}">${character}</span>`);
        });
    }

    function updateControls() {
        roundSpan.textContent = session.gamesPlayed.toString();
        winStreakSpan.textContent = session.winStreak.toString();
        console.log(game.word);
    }

    function updateCurrentGuess() {
        const guessDivs = gameDiv.querySelectorAll(`.guesses .guess:nth-child(${game.guesses.length + 1}) .character`);
        guessDivs.forEach((div, index) => {
            div.textContent = currentGuess.trim()[index] ?? "";
        });
    }

    function updateCharacters() {
        const characterDivs = gameDiv.querySelectorAll(`.characters .character`);
        characterDivs.forEach((div) => {
            const character = div.getAttribute('data-character');
            const state = game.characterStatus(character);
            div.classList.remove("idle", "present", "correct", "absent");
            div.classList.add(state);
        });
    }

    function updateGuessResult() {
        const guessDivs = gameDiv.querySelectorAll(`.guesses .guess`);
        guessDivs.forEach((div, index) => {
            if(index < game.guesses.length) {
                div.classList.toggle('old', true);
                div.classList.toggle('current', false);

                div.querySelectorAll(".character").forEach((character) => {
                    const char = character.textContent;
                    const state = game.characterGuessStatus(char, index);
                    character.classList.remove("idle", "present", "correct", "absent");
                    character.classList.add(state);
                })
            }
            else if(index === game.guesses.length) {
                div.classList.toggle('current', true);
            }
        })
    }

    startBtn.addEventListener('click', () => {
        session.startNewGame();
        game = session.currentGame;
        currentGuess = " ".repeat(5);
        updateCurrentGuess();
        updateControls();
        buildCleanGame();
    });

    document.addEventListener("keydown", (event) => {

        if(game.finished) return;

        if(event.key === "Enter") {
            try {
                game.guessWord(currentGuess);
                currentGuess = " ".repeat(5);

                if(game.won) {
                    alert("You won!");
                    updateControls();
                }

                else if (game.finished) {
                    alert(`You lost! The word was: ${game.word}`);
                    updateControls();
                }

                updateGuessResult();
                updateCharacters();
            }
            catch(e) {
                alert(e.message);
            }
        }
        if(event.key === "Backspace") {
            currentGuess = currentGuess.slice(0, -1);
            updateCurrentGuess();
        }

        if(event.key.length === 1 && event.key.match(/[a-z]/i)) {
            currentGuess += event.key.toLowerCase();
            currentGuess = currentGuess.padStart(6, " ").slice(1);
            updateCurrentGuess();
        }

    }, { signal: destroy });

    updateControls();
    buildCleanGame();
    updateGuessResult();
}
