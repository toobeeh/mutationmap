import {useContext} from "react";
import {SessionContext} from "../SessionContext.ts";
import "./Leaderboard.css";

export default function Leaderboard() {
    const session = useContext(SessionContext);

    if(session === null) {
        throw new Error("session unexpectedly null");
    }

    /**
     * ordered leaderboard by win streak and average guesses
     * reactive to session changes, not leaderboard changes
     */
    const leaderboard = [...(session.getLeaderboard().entries() ?? [])
    ].sort(([, a], [, b]) =>
        b.winStreak - a.winStreak || a.averageGuesses - b.averageGuesses
    ).map(([username, result], index) => {
        return (
            <div className="rank">
                <span className="place">#{index + 1}</span>
                <span className="username">{username}</span>
                <span className="streak">Streak: {result.winStreak}</span>
                <span className="average">Avg. Guesses: {result.averageGuesses.toFixed(2)}</span>
            </div>
        );
    });

    if(leaderboard.length === 0) {
        return (
            <div id="leaderboard">
                <p>Be the frst in the leaderboard!</p>
            </div>
        );
    }

    return (
        <div className="leaderboard">
            {leaderboard}
        </div>
    );
}
