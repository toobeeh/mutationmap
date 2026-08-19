import {Session} from "wordle-lib";
import "./leaderboard.css";

export function renderLeaderboard(session: Session, main: HTMLElement) {

    /* build content, no interactions needed */
    const leaderboard = [...(session.getLeaderboard().entries())]
        .sort(([, a], [, b]) =>
            b.winStreak - a.winStreak || a.averageGuesses - b.averageGuesses
        )
        .map(([username, result], index) => {
            return `
                    <div class="rank">
                        <span class="place">#${index + 1}</span>
                        <span class="username">${username}</span>
                        <span class="streak">Streak: ${result.winStreak}</span>
                        <span class="average">Avg. Guesses: ${result.averageGuesses.toFixed(2)}</span>
                    </div>
                `;
        });

    /* build template */
    main.innerHTML = `
        <section>
            ${leaderboard.length === 0 ? 
                "<p>Be the frst in the leaderboard!</p>" : 
                `<div class="leaderboard">${leaderboard.join('')}</div>`
            }
        </section>
    `;
}
