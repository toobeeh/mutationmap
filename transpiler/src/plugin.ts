import type {Plugin} from "vite";
import {InstrumentationUnitAnalyzer} from "./instrumentationUnitAnalyzer.js";
import {InstrumentationTranspiler} from "./transpiler.js";
import * as path from "path";

/**
 * Vite plugin to parse attribution units from source code and
 * instrument the units with execution events & last-executed unit indicator.
 */
export function instrumentMutationAttribution(repoSourcePath: string | undefined): Plugin {

    const virtualModuleId = "virtual:instrumentation-handler";
    const resolvedVirtualModuleId = "\0" + virtualModuleId;

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

        /**
         * Resolve the virtual module ID for the instrumentation handler
         * @param id
         */
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
            return undefined;
        },

        /**
         * Load the virtual module for the instrumentation handler, which provides the handle function to be called by instrumented code
         * Virtual module needs to be imported in any instrumented modules
         * @param id
         */
        load(id) {
            if (id === resolvedVirtualModuleId) {
                return `
                    const index = ${JSON.stringify(transpiler.getUnitIndex())};
                
                    export function handle(id) {
                        const [file, unitIndex] = id.split("#");
                        const unit = index[file]?.[unitIndex];
                        document.dispatchEvent(new CustomEvent("attributionUnitEntered", {detail: unit}));
                    }
                `;
            }

            return undefined;
        },

        /**
         * Transform the source code of a module to instrument attribution units
         * @param src
         * @param id
         */
        async transform(src, id) {

            /* skip all non-user code */
            if (id.includes("node_modules")) {
                return null;
            }

            /* skip non ts/js files */
            if (!id.endsWith(".ts") && !id.endsWith(".js")) {
                return null;
            }

            /* analyze units and transpile file to instrumented source */
            try {
                const units = await analyzer.analyzeText(id, src);

                const transpiledSource =
                    units.length == 0 ? src :
                    transpiler.transpileToInstrumentedUnits(units, id);

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
        }
    }
}
