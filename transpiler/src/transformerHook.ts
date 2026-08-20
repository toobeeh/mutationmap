import type {instrumentationPluginOptions} from "./pluginOptions.interface.js";
import type {InstrumentationUnitAnalyzer} from "./instrumentationUnitAnalyzer.js";
import type {InstrumentationTranspiler} from "./transpiler.js";

export function transformerHook(
    options: instrumentationPluginOptions,
    analyzer: InstrumentationUnitAnalyzer,
    transpiler: InstrumentationTranspiler
) {
    return async (code: string, id: string) => {

        if(options.log !== "silent") console.log("Analyzing file:", id);
        if(options.log === "debug") console.log("Analyzing code:", code);

        try {
            const units = await analyzer.analyzeText(id, code);

            const transpiledSource =
                units.length == 0 ? code :
                    transpiler.transpileToInstrumentedUnits(units, id);

            if(options.log !== "silent") console.log("Found units:", units.length);
            if(options.log === "debug") console.log(units);

            return {
                code: transpiledSource,
                map: null
            }
        }
        catch (err) {
            if(options.log !== "silent") console.error("Error analyzing file:", id, err);
        }

        return {
            code: code,
            map: null
        }
    }
}
