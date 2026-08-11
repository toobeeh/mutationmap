import {AttributionUnitAnalyzer } from "mutationmap-analyzer";
import type {instrumentationAttributionUnit} from "./types/instrumentationAttributionUnit.interface.js";
import {Node, Project} from "ts-morph";
import type {regionParser} from "mutationmap-analyzer/dist/types/region-parser.interface.js";
import type {propertyParser} from "mutationmap-analyzer/dist/types/property-parser.interface.js";
import type {analyzerConfig} from "mutationmap-analyzer/dist/types/analyzer-config.interface.js";
import {FunctionRegionParser} from "mutationmap-analyzer/dist/functionRegionParser.js";
import {InstrumentationPropertyParser} from "./instrumentationPropertyParser.js";

/**
 * Attribution unit analyzer to parse attribution units that contain instrumentation-relevant
 * properties, based on function-like regions from a codebase in AST-representation.
 */
export class InstrumentationUnitAnalyzer extends AttributionUnitAnalyzer<Project, instrumentationAttributionUnit, Node> {

    protected override readonly _regionParser: regionParser<Project, Node>;
    protected override readonly _propertyParser: propertyParser<instrumentationAttributionUnit, Node>;

    constructor(protected override readonly _config: analyzerConfig) {
        super(_config);
        this._regionParser = new FunctionRegionParser();
        this._propertyParser = new InstrumentationPropertyParser(_config.repoSourcePath);
    }

    /**
     * Wrapper to analyze a text as a codebase, using an alias path for AST parsing context.
     * Calls analyzeCodebase with a ts-morph Project instance as codebase.
     * @param aliasPath path that will be used for file location in unit properties
     * @param text js/ts source code in plain text to analyze for attribution units
     */
    async analyzeText(aliasPath: string, text: string): Promise<instrumentationAttributionUnit[]> {

        /* init AST parsing context */
        const project = new Project({
            compilerOptions: {
                allowJs: true
            }
        });
        project.createSourceFile(aliasPath, text, {overwrite: true});

        return this.analyzeCodebase(project);
    }
}
