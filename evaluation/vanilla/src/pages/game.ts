import {Session} from "wordle-lib";
import "./game.css";

export function renderGame(session: Session, main: HTMLElement, destroy: AbortSignal) {

    main.innerHTML = `
        <section>
            <div class="controls">
                <span>Round: <span id="round">1</span></span>
                <span>Streak: <span id="win-streak">0</span></span>   
                <button id="new-game">New Game</button>
            </div>
            
            <div class="game">
                <div class="guesses"></div>
                <div class="characters"></div>
            </div>
        </section>
    `;

    /* get template elements */
    const startBtn = main.querySelector('#new-game');
    const roundSpan = main.querySelector('#round');
    const winStreakSpan = main.querySelector('#win-streak');
    const gameDiv = main.querySelector('.game');
    const charactersDiv = main.querySelector('.characters');
    const guessesDiv = main.querySelector('.guesses');

    let game = session.currentGame;
    let currentGuess = " ".repeat(5);

    /**
     * Builds the game grid and character list with empty boxes and fills in any previous guesses if the game is running
     */
    function buildCleanGame() {
        guessesDiv.innerHTML = '';
        for(let i = 0; i < 5; i++) {
            let wordBoxes = "<span class='character'></span>".repeat(5);
            guessesDiv.insertAdjacentHTML('beforeend', `<div class="guess"">${wordBoxes}</div>`);

            /* if game is running, fill boxes with guess */
            if(game.guesses[i] !== undefined) {
                const guessDivs = guessesDiv.querySelectorAll(`.guess:nth-child(${i + 1}) .character`);
                guessDivs.forEach((div, index) => {
                    div.textContent = game.guesses[i][index] ?? "";
                });
            }
        }

        charactersDiv.innerHTML = '';
        game.characters.forEach((character) => {
            charactersDiv.insertAdjacentHTML('beforeend', `<span class="character" data-character="${character}">${character}</span>`);
        });
    }

    /**
     * Update the controls with the current round and win streak from the session
     */
    function updateControls() {
        roundSpan.textContent = session.gamesPlayed.toString();
        winStreakSpan.textContent = session.winStreak.toString();
        console.log(game.word);
    }

    /**
     * Updates the current guess in the game grid with the characters typed by the player
     */
    function updateCurrentGuess() {
        const guessDivs = gameDiv.querySelectorAll(`.guesses .guess:nth-child(${game.guesses.length + 1}) .character`);
        guessDivs.forEach((div, index) => {
            div.textContent = currentGuess.trim()[index] ?? "";
        });
    }

    /**
     * Updates the character list with the status of each character based on the previous guesses and the current game state
     */
    function updateCharacters() {
        const characterDivs = gameDiv.querySelectorAll(`.characters .character`);
        characterDivs.forEach((div) => {
            const character = div.getAttribute('data-character');
            const state = game.characterStatus(character);
            div.classList.remove("idle", "present", "correct", "absent");
            div.classList.add(state);
        });
    }

    /**
     * Updates the game grid with the results of the previous guesses,
     * marking each character as correct, present, or absent based on the current game state
     */
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
                });
            }
            else if(index === game.guesses.length && !game.finished) {
                div.classList.toggle('current', true);
            }
        })
    }

    /**
     * Start new game when button clicked
     */
    startBtn.addEventListener('click', () => {
        session.startNewGame();
        game = session.currentGame;
        currentGuess = " ".repeat(5);
        updateCurrentGuess();
        updateControls();
        buildCleanGame();
    });

    /**
     * Handle keydown events for guessing words, deleting characters, and submitting guesses.
     * Receives an abort signal to clean up the event listener when the game is destroyed.
     */
    document.addEventListener("keydown", (event) => {

        if(game.finished) return;

        if(event.key === "Enter") {
            try {
                game.guessWord(currentGuess);
                currentGuess = " ".repeat(5);

                if(game.won) {
                    alert("You won!");
                    updateControls();
                    session.updateLeaderboard();
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

    /* init state */
    updateControls();
    buildCleanGame();
    updateGuessResult();
    updateCharacters();
}
