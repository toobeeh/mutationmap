import type {attributionUnit} from "mutationmap-analyzer/dist/types/attribution-unit.interface.js";
import type {functionLikeIdentifier} from "mutationmap-analyzer/dist/corePropertyParser.js";
import type {FunctionNode} from "mutationmap-analyzer/dist/functionRegionParser.js";

/**
 * Extended attribution unit interface for transpilation purposes
 */
export interface instrumentationAttributionUnit extends attributionUnit {

    /**
     * Kind of function-like region
     */
    functionKind: string;

    /**
     * Identifier parts as object for versatility
     */
    identifier: functionLikeIdentifier;

    /**
     * Node reference for transpiling
     */
    node: FunctionNode;
}
