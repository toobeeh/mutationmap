import './App.css';
import {Link, Outlet, Route, Routes, useNavigate} from "react-router";
import {useState} from "react";
import Login from "./components/Login.tsx";
import Leaderboard from "./components/Leaderboard.tsx";
import Game from "./components/Game.tsx";
import {SessionContext} from "./SessionContext.ts";
import type {Session} from "wordle-lib";
import {ProtectedRoute} from "./SessionRoute.tsx";

function App() {

    const [session, setSession] = useState<Session | null>(null);
    const navigate = useNavigate();

    return (
        <div id="app">
            <header>
                <h1>React Wordle</h1>
            </header>

            <nav>
                <Link to="/">Log In</Link>
                <Link to="/leaderboard">Leaderboard</Link>
                <Link to="/game">Play</Link>
            </nav>

            <main>
                <SessionContext value={session}>

                    <Routes>
                        <Route index element={
                            <Login submitSession={s => {
                                setSession(s);
                                navigate("game");
                            }} />}
                        />
                        <Route path="/leaderboard" element={
                            <ProtectedRoute session={session}>
                                <Leaderboard />
                            </ProtectedRoute>}
                        />
                        <Route path="/game" element={
                            <ProtectedRoute session={session}>
                                <Game />
                            </ProtectedRoute>}
                        />
                    </Routes>

                    <Outlet />

                </SessionContext>
            </main>

            <footer>
                <span>Mutation attribution evaluation @ react</span>
            </footer>
        </div>
    );
}

export default App;
