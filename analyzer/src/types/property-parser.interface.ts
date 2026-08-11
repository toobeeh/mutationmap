import {Node} from "ts-morph";
import type {attributionUnit} from "./attribution-unit.interface.js";
import type {analyzerConfig} from "./analyzer-config.interface.js";

/**
 * Parses an attribution unit with properties from a given region.
 *
 * TUnit: The type of the attribution unit to parse, containing the defined set of properties
 * TRegion: The type of the region where metadata is parsed from (e.g., AST node, file, etc.)
 */
export interface propertyParser<TUnit extends attributionUnit, TRegion> {
    parseProperties(config: analyzerConfig, region: TRegion): Promise<TUnit>;
}
