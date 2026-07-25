import type {Node, Project} from "ts-morph";

/**
 * Parse regions from a given parse result
 * A region is the code entity that will be used as attribution unit.
 */
export interface regionParser<TRegion extends Node> {
    parseRegions(project: Project): TRegion[];
}
