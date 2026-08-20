import type {Plugin, PluginOption} from "vite";
import {InstrumentationUnitAnalyzer} from "./instrumentationUnitAnalyzer.js";
import {InstrumentationTranspiler} from "./transpiler.js";
import * as path from "path";
import {vanillaTransformerPlugin} from "./plugins/vanillaTransformer.js";
import {virtualModuleLoaderPlugin} from "./plugins/virtualModuleLoader.js";
import type {instrumentationPluginOptions} from "./pluginOptions.interface.js";
import {svelteTransformerPlugin} from "./plugins/svelteTransformer.js";

/**
 * Vite plugin to parse attribution units from source code and
 * instrument the units with execution events & last-executed unit indicator.
 */
export function instrumentMutationAttribution(options: instrumentationPluginOptions): PluginOption[] {

    /* resolve path if relative */
    const repoSourcePath = options.repoSourcePath !== undefined ? path.resolve(options.repoSourcePath) : undefined;

    if (repoSourcePath !== undefined && options.log !== "silent") {
        console.log("Using repo source path for mutation attribution:", repoSourcePath);
    }

    const virtualModuleId = "virtual:instrumentation-handler";
    const resolvedVirtualModuleId = "\0" + virtualModuleId;

    const analyzer = new InstrumentationUnitAnalyzer({repoSourcePath});
    const transpiler = new InstrumentationTranspiler(virtualModuleId);

    return [
        virtualModuleLoaderPlugin(virtualModuleId, resolvedVirtualModuleId),
        vanillaTransformerPlugin(analyzer, transpiler, options),
        svelteTransformerPlugin(analyzer, transpiler, options)
    ]
}
