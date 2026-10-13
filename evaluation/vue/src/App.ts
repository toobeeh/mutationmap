import {defineComponent} from "vue";

export default defineComponent({
    template: `
    <header>
        <h1>Vue Wordle</h1>
    </header>

    <nav>
      <RouterLink to="/">Log In</RouterLink>
      <RouterLink to="/leaderboard">Leaderboard</RouterLink>
      <RouterLink to="/game">Play</RouterLink>
    </nav>

    <main>
      <RouterView />
    </main>

    <footer>
        <span>Mutation attribution evaluation @ Vue</span>
    </footer>`
});
