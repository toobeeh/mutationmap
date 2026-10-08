import { instrumentMutationAttribution } from "mutationmap-transpiler";
import {defineConfig} from "vite";

export default defineConfig({
    plugins: [
        instrumentMutationAttribution({repoSourcePath: "../", log: "info"})
    ]
});
