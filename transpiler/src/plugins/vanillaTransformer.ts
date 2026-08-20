import type {PluginOption} from "vite";
import type {InstrumentationUnitAnalyzer} from "../instrumentationUnitAnalyzer.js";
import type {InstrumentationTranspiler} from "../transpiler.js";
import type {instrumentationPluginOptions} from "../pluginOptions.interface.js";
import {transformerHook} from "../transformerHook.js";

export function vanillaTransformerPlugin(
    analyzer: InstrumentationUnitAnalyzer,
    transpiler: InstrumentationTranspiler,
    options: instrumentationPluginOptions
): PluginOption {

    return {
        name: "mutation-attribution-instrumentation | vanilla-transformer",

        transform: {

            /* transform ts, js - excluding dependencies */
            filter: {
                id: {
                    include: [/\.ts$/, /\.js$/],
                    exclude: /node_modules/
                }
            },

            /* AST can be directly parsed, run before compilation */
            order: "pre",

            /* perform mutation attribution analysis on AST and instrument code */
            handler: transformerHook(options, analyzer, transpiler)
        }
    }
}
