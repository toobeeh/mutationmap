import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import {instrumentMutationAttribution} from "mutationmap-transpiler";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      svelte(),
      instrumentMutationAttribution({repoSourcePath: "../", log: "info"})
  ],
})
