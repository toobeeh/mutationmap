import type {PluginOption} from "vite";

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
                return `
                    const index = {};
                    
                    export function register(fileHash, units) {
                        index[fileHash] = units;
                    }
                
                    export function handle(id) {
                        const [file, unitIndex] = id.split("#");
                        const unit = index[file]?.[unitIndex];
                        if(!unit) {
                            console.warn("No unit found for id:", id);
                        }
                        else {
                            document.dispatchEvent(new CustomEvent("attributionUnitEntered", {detail: unit}));
                        }
                    }
                `;
            }

            return undefined;
        }
    }
}
