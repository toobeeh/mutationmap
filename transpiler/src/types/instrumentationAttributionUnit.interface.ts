import type {attributionUnit} from "mutationmap-analyzer/dist/types/attribution-unit.interface.js";
import type {functionLikeIdentifier} from "mutationmap-analyzer/dist/corePropertyParser.js";

export interface instrumentationAttributionUnit extends attributionUnit {
    functionKind: string;
    identifier: functionLikeIdentifier;
}
