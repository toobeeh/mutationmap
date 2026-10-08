import type {Session} from "wordle-lib";

export class WordleLeaderboard extends HTMLElement {
    private _session?: Session;

    public set session(session: Session) {
        this._session = session;
        this.buildLeaderboard();
    }

    public get session() {
        return this._session;
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.buildLeaderboard();
    }

    buildLeaderboard() {

        /* build content, no interactions needed */
        const leaderboard = [...(this.session?.getLeaderboard().entries() ?? [])]
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

        this.shadowRoot.innerHTML = `

        <style>
        .leaderboard{
            display: grid;
            grid-template-columns: auto auto auto auto;
            align-items: center;
            justify-content: center;
            row-gap: 1rem;
            column-gap: 1rem;
        }
        
        .rank {
            display: contents;
        }
        
        .rank .place {
            font-size: 1.2em;
            opacity: .9;
        }
        
        .rank .username {
            display: flex;
            align-items: center;
            font-weight: bold;
        }
        
        .rank .username:before {
            content: "👤";
            padding-right: .5rem;
        }
        
        .rank :is(.streak, .average) {
            opacity: .9;
            font-style: italic;
        }
        </style>

        <section>
            ${leaderboard.length === 0 ?
            "<p>Be the frst in the leaderboard!</p>" :
            `<div class="leaderboard">${leaderboard.join('')}</div>`
        }
        </section>
        `;
    }

}

customElements.define('wordle-leaderboard', WordleLeaderboard);
