/**
 * An entity that causes DOM mutations and can be used to
 * attribute the mutations to a source code location
 */
export interface attributionUnit<TIdentifier = string> {

    /**
     * The identifier of the attribution unit.
     * May be plain string or object with multiple properties for versatility
     */
    identifier: TIdentifier;

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
