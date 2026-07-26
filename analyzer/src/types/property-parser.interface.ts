import {Node} from "ts-morph";
import type {attributionUnit} from "./attribution-unit.interface.js";

/**
 * Parse an attribution unit from a given region
 *
 * @param path The path of the file being analyzed
 * @param unit The region as AST node
 * @returns The parsed attribution unit
 */
export interface propertyParser<TUnit extends attributionUnit, TRegion extends Node> {
    parseProperties(path: string, region: TRegion): TUnit;
}
