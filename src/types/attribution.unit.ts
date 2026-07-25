/**
 * An entity that causes DOM mutations and can be used to
 * attribute the mutations to a source code location
 */
export interface attributionUnit {

    /**
     * The name of the attribution unit.
     * Format: [className].[functionName]
     * or [className].[functionName]([constants)]
     * if the unit has no identifier and passed as expression
     */
    name: string;

    /**
     * The location of the unit in the source code.
     * Format: [path] #[lineStart]:[lineEnd]
     */
    location: string;

    /**
     * The author of the unit.
     * Parsed from git metadata.
     */
    author: string;
}
