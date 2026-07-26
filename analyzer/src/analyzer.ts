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
 * @param path path to the file to analyze
 * @param regionParser parser for a specific region type, used as a basis for parsed attribution units
 * @param propertyParser parser for the properties of the attribution unit
 */
export async function analyzeAttributionUnitsInFile<TUnit extends attributionUnit, TRegion extends Node>(
    config: analyzerConfig,
    path: string,
    regionParser: regionParser<TRegion>,
    propertyParser: propertyParser<TUnit, TRegion>
): Promise<TUnit[]> {

    /* init AST parsing context */
    const project = new Project({
        compilerOptions: {
            allowJs: true
        }
    });
    project.addSourceFileAtPath(path);

    return analyzeAttributionUnitsInProject<TUnit, TRegion>(config, project, regionParser, propertyParser);
}

/**
 * Analyzes a plain text for attribution units using the provided region and property parsers.
 * @param config configuration for the analyzer
 * @param aliasPath an alias path to use for the text, used for AST parsing context
 * @param text the text to analyze, being the content of a ts or js source file
 * @param regionParser parser for a specific region type, used as a basis for parsed attribution units
 * @param propertyParser parser for the properties of the attribution unit
 */
export async function analyzeAttributionUnitsInText<TUnit extends attributionUnit, TRegion extends Node>(
    config: analyzerConfig,
    aliasPath: string,
    text: string,
    regionParser: regionParser<TRegion>,
    propertyParser: propertyParser<TUnit, TRegion>
): Promise<TUnit[]> {

    /* init AST parsing context */
    const project = new Project({
        compilerOptions: {
            allowJs: true
        }
    });
    project.createSourceFile(aliasPath, text);

    return analyzeAttributionUnitsInProject<TUnit, TRegion>(config, project, regionParser, propertyParser);
}

async function analyzeAttributionUnitsInProject<TUnit extends attributionUnit, TRegion extends Node>(
    config: analyzerConfig,
    project: Project,
    regionParser: regionParser<TRegion>,
    propertyParser: propertyParser<TUnit, TRegion>
): Promise<TUnit[]> {

    /* parse unit regions */
    const regions = regionParser.parseRegions(project);

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
 * for tasks where consecutive files are being analyzed
 */
export abstract class AttributionUnitAnalyzer<TUnit extends attributionUnit, TRegion extends Node> {

    protected abstract readonly _regionParser: regionParser<TRegion>;
    protected abstract readonly _propertyParser: propertyParser<TUnit, TRegion>;

    protected constructor(protected readonly _config: analyzerConfig) { }

    async analyzeFile(path: string): Promise<TUnit[]> {
        return analyzeAttributionUnitsInFile<TUnit, TRegion>(this._config, path, this._regionParser, this._propertyParser);
    }

    async analyzeText(aliasPath: string, text: string): Promise<TUnit[]> {
        return analyzeAttributionUnitsInText<TUnit, TRegion>(this._config, aliasPath, text, this._regionParser, this._propertyParser);
    }
}

/**
 * Default mutation attribution analyzer as per specification,
 * which parses function-like regions and their properties to attribution units
 */
export class FunctionUnitAnalyzer extends AttributionUnitAnalyzer<attributionUnit, Node> {

    protected override readonly _regionParser: regionParser<Node>;
    protected override readonly _propertyParser: propertyParser<attributionUnit, Node>;

    constructor(protected override readonly _config: analyzerConfig) {
        super(_config);
        this._regionParser = new FunctionRegionParser();
        this._propertyParser = new CorePropertyParser(_config.repoSourcePath);
    }
}

