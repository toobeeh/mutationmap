
/**
 * Parses regions from a given codebase.
 * A region is the code entity that will be used as attribution unit.
 *
 * TCodebase: The type of the codebase to parse regions from (e.g., path, parsed AST, etc.)
 * TRegion: The type of the region to parse (e.g., AST node, file, etc.)
 */
export interface regionParser<TCodebase, TRegion> {
    parseRegions(codebase: TCodebase): TRegion[];
}
