import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import {instrumentMutationAttribution} from "mutationmap-transpiler";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      instrumentMutationAttribution({repoSourcePath: "../", log: "info"}),
      react()
  ],
})
