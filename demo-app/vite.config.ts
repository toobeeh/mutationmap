import { instrumentMutationAttributionPlugin } from "mutationmap-transpiler";
import { defineConfig } from "vite";


export default defineConfig({
    plugins: [
        instrumentMutationAttributionPlugin()
    ],
})
