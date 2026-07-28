import type {PluginOption} from "vite";
import {InstrumentationUnitAnalyzer} from "./instrumentationUnitAnalyzer.js";
import {InstrumentationTranspiler} from "./transpiler.js";
import * as path from "path";

/**
 * Vite plugin to parse attribution units from source code and
 * instrument the units with execution events & last-executed unit indicator.
 */
export function instrumentMutationAttribution(repoSourcePath: string | undefined): PluginOption {

    /* resolve path if relative */
    repoSourcePath = repoSourcePath !== undefined ? path.resolve(repoSourcePath) : undefined;

    if(repoSourcePath !== undefined){
        console.log("Using repo source path for mutation attribution:", repoSourcePath);
    }

    const analyzer = new InstrumentationUnitAnalyzer({repoSourcePath});
    const transpiler = new InstrumentationTranspiler();

    return {
        name: 'instrument-mutation-attribution',
        enforce: 'pre',

        async transform(src, id) {

            /* skip all non-user code */
            if (id.includes("node_modules")) {
                return null;
            }

            /* analyze units and transpile file to instrumented source */
            try {
                const units = await analyzer.analyzeText(id, src);
                const transpiledSource =
                    units.length == 0 ? src :
                    transpiler.transpileToInstrumentedUnits(units, id, true);

                return {
                    code: transpiledSource,
                    map: null
                }
            }
            catch (err) {
                console.error("Error analyzing file:", id, err);
            }

            return {
                code: src,
                map: null
            }
        },
    }
}
