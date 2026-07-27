import {AttributionUnitAnalyzer} from "mutationmap-analyzer";
import type {instrumentationAttributionUnit} from "./types/instrumentationAttributionUnit.interface.js";
import {Node} from "ts-morph";
import type {regionParser} from "mutationmap-analyzer/dist/types/region-parser.interface.js";
import type {propertyParser} from "mutationmap-analyzer/dist/types/property-parser.interface.js";
import type {analyzerConfig} from "mutationmap-analyzer/dist/types/analyzer-config.interface.js";
import {FunctionRegionParser} from "mutationmap-analyzer/dist/functionRegionParser.js";
import {InstrumentationPropertyParser} from "./instrumentationPropertyParser.js";

export class InstrumentationUnitAnalyzer extends AttributionUnitAnalyzer<instrumentationAttributionUnit, Node> {

    protected override readonly _regionParser: regionParser<Node>;
    protected override readonly _propertyParser: propertyParser<instrumentationAttributionUnit, Node>;

    constructor(protected override readonly _config: analyzerConfig) {
        super(_config);
        this._regionParser = new FunctionRegionParser();
        this._propertyParser = new InstrumentationPropertyParser(_config.repoSourcePath);
    }
}
