import vue from '@vitejs/plugin-vue'
import {defineConfig, type PluginOption} from 'vite'
import {instrumentMutationAttribution} from "mutationmap-transpiler";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        instrumentMutationAttribution({repoSourcePath: "../", log: "info"}) as PluginOption[],
        vue()
    ],
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js'
        }
    }
});
