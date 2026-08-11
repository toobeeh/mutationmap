import type {attributionUnit} from "./types/attribution-unit.interface.js";
import type {analyzerConfig} from "./types/analyzer-config.interface.js";
import type {regionParser} from "./types/region-parser.interface.js";
import type {propertyParser} from "./types/property-parser.interface.js";
import {FunctionRegionParser} from "./functionRegionParser.js";
import {FunctionPropertyParser} from "./functionPropertyParser.js";
import {Project, Node} from "ts-morph";

/**
 * Main function for performing attribution unit analysis,
 * on a given codebase using given region parser to parse regions in the codebase,
 * and a given property parser to extract attribution units from the region.
 * @param config configuration for the analyzer
 * @param codebase the codebase to analyze, which can be a path, a parsed AST, or any other representation
 * @param regionParser codebase-compatible region parser for a specific region type, used as a basis for parsed attribution units
 * @param propertyParser parser for the properties of the attribution unit
 */
async function analyzeAttributionUnits<TCodebase, TUnit extends attributionUnit, TRegion extends Node>(
    config: analyzerConfig,
    codebase: TCodebase,
    regionParser: regionParser<TCodebase, TRegion>,
    propertyParser: propertyParser<TUnit, TRegion>
): Promise<TUnit[]> {

    /* parse unit regions */
    const regions = regionParser.parseRegions(codebase);

    /* parse properties of units */
    const units: TUnit[] = [];
    for (const region of regions) {
        const unit = await propertyParser.parseProperties(config, region);
        units.push(unit);
    }

    return units;
}

/**
 * Abstract attribution unit analyzer to perform mutation attribution analysis,
 * for tasks where consecutive files are being analyzed and state
 * or instances should be preserved across iterations
 */
export abstract class AttributionUnitAnalyzer<TCodebase, TUnit extends attributionUnit, TRegion extends Node> {

    protected abstract readonly _regionParser: regionParser<TCodebase, TRegion>;
    protected abstract readonly _propertyParser: propertyParser<TUnit, TRegion>;

    protected constructor(protected readonly _config: analyzerConfig) { }

    /**
     * Analyzes a codebase for attribution units using the provided region and property parsers.
     * @param codebase the codebase to analyze, depending on implementation
     */
    async analyzeCodebase(codebase: TCodebase): Promise<TUnit[]> {
        return analyzeAttributionUnits<TCodebase, TUnit, TRegion>(this._config, codebase, this._regionParser, this._propertyParser);
    }
}

/**
 * Default mutation attribution analyzer as per specification,
 * which parses function-like regions and their properties to attribution units.
 * Uses AST-based analysis with ts-morph, which "Project" type is the codebase representation.
 */
export class FunctionUnitAnalyzer extends AttributionUnitAnalyzer<Project, attributionUnit, Node> {

    protected override readonly _regionParser: regionParser<Project, Node>;
    protected override readonly _propertyParser: propertyParser<attributionUnit, Node>;

    constructor(protected override readonly _config: analyzerConfig) {
        super(_config);
        this._regionParser = new FunctionRegionParser();
        this._propertyParser = new FunctionPropertyParser(_config.repoSourcePath);
    }
}

