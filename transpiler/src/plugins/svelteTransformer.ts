import type {PluginOption} from "vite";
import type {InstrumentationUnitAnalyzer} from "../instrumentationUnitAnalyzer.js";
import type {InstrumentationTranspiler} from "../transpiler.js";
import type {instrumentationPluginOptions} from "../pluginOptions.interface.js";
import {transformerHook} from "../transformerHook.js";

export function svelteTransformerPlugin(
    analyzer: InstrumentationUnitAnalyzer,
    transpiler: InstrumentationTranspiler,
    options: instrumentationPluginOptions
): PluginOption {

    return {
        name: "mutation-attribution-instrumentation | svelte-transformer",

        transform: {

            /* transform ts, js - excluding dependencies */
            filter: {
                id: {
                    include: [/\.svelte$/],
                    exclude: /node_modules/
                }
            },

            /* svelte cannot be AST-parsed, use generated js module code */
            order: null,

            /* perform mutation attribution analysis on AST and instrument code */
            handler: transformerHook(options, analyzer, transpiler)
        }
    }
}
