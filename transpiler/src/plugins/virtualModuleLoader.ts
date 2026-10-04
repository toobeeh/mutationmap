import type {PluginOption} from "vite";
import {mutationHandlerModule} from "../mutationHandlerModule.js";

export function virtualModuleLoaderPlugin(moduleId: string, resolvedModuleId: string): PluginOption {

    return {
        name: "mutation-attribution-instrumentation | module-loader",

        /**
         * Resolve the virtual module ID for the instrumentation handler
         * @param id
         */
        resolveId(id) {
            if (id === moduleId) {
                return resolvedModuleId;
            }
            return undefined;
        },

        /**
         * Load the virtual module for the instrumentation handler, which provides the handle function to be called by instrumented code
         * Virtual module needs to be imported in any instrumented modules
         * @param id
         */
        load(id) {
            if (id === resolvedModuleId) {
                return mutationHandlerModule;
            }

            return undefined;
        }
    }
}
