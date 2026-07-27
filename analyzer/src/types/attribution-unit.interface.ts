/**
 * An entity that causes DOM mutations and can be used to
 * attribute the mutations to a source code location
 */
export interface attributionUnit {

    /**
     * The expressive name of the attribution unit, describing its semantic content
     */
    name: string;

    /**
     * The location of the unit in the source code
     */
    location: {
        file: string;
        startLine: number;
        endLine: number;
    }

    /**
     * The author of the unit.
     * Parsed from git metadata.
     */
    author: string;
}
