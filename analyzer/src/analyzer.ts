import type {attributionUnit} from "./types/attribution-unit.interface.js";
import type {analyzerConfig} from "./types/analyzer-config.interface.js";
import type {regionParser} from "./types/region-parser.interface.js";
import type {propertyParser} from "./types/property-parser.interface.js";
import {FunctionRegionParser} from "./functionRegionParser.js";
import {CorePropertyParser} from "./corePropertyParser.js";
import {Project, Node} from "ts-morph";

/**
 * Analyzes a file for attribution units using the provided region and property parsers.
 * @param config configuration for the analyzer
 * @param regionParser parser for a specific region type, used as a basis for parsed attribution units
 * @param propertyParser parser for the properties of the attribution unit
 */
export function analyzeAttributionUnits<TUnit extends attributionUnit, TRegion extends Node>(
    config: analyzerConfig,
    regionParser: regionParser<TRegion>,
    propertyParser: propertyParser<TUnit, TRegion>
): TUnit[] {

    /* init AST parsing context */
    const project = new Project({
        compilerOptions: {
            allowJs: true
        }
    });
    project.addSourceFileAtPath(config.path);

    /* parse unit regions */
    const regions = regionParser.parseRegions(project);

    /* parse properties of units */
    const units: TUnit[] = [];
    for(const region of regions) {
        const unit = propertyParser.parseProperties(config.path, region);
        units.push(unit);
    }

    return units;
}

export function analyzeFunctionAttributionUnits(config: analyzerConfig) {
    return analyzeAttributionUnits<attributionUnit, Node>(config, new FunctionRegionParser(), new CorePropertyParser());
}

