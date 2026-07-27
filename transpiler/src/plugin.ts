import type {PluginOption} from "vite";
import {InstrumentationUnitAnalyzer} from "./instrumentationUnitAnalyzer.js";
import * as path from "path";

export function instrumentMutationAttributionPlugin(): PluginOption {

    const root = path.resolve(process.cwd(), "src");
    const analyzer = new InstrumentationUnitAnalyzer({});

    console.log({root});

    return {
        name: 'instrument-mutation-attribution',
        enforce: 'pre',

        async transform(src, id) {

            /* skip all non-user code */
            if (id.includes("node_modules")) {
                return null;
            }

            try {
                const units = await analyzer.analyzeText(id, src);
                console.log(units, id);
            }
            catch (err) {
                console.error("Error analyzing file:", id);
            }
            return {
                code: src,
                map: null
            }
        },
    }
}
