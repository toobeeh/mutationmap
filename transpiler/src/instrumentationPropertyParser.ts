import {CorePropertyParser} from "mutationmap-analyzer/dist/corePropertyParser.js";
import {type FunctionNode} from "mutationmap-analyzer/dist/functionRegionParser.js";
import type {instrumentationAttributionUnit} from "./types/instrumentationAttributionUnit.interface.js";
import type {analyzerConfig} from "mutationmap-analyzer/dist/types/analyzer-config.interface.js";

export class InstrumentationPropertyParser extends CorePropertyParser {

    override async parseProperties(_: analyzerConfig, region: FunctionNode): Promise<instrumentationAttributionUnit> {

        /* core properties */
        const identifier = this.getIdentificationFromFunctionLikeRegion(region);
        const location = this.getLocationFromFunctionNode(region);
        const name = this.getNameFromIdentifier(identifier);

        let author = "Unknown";
        try {
            const gitBlame = await this.getGitBlameForRegion(region);
            author = (gitBlame !== undefined ? this.getAuthorFromGitBlame(gitBlame) : undefined) ?? "Unknown";
        }
        catch (error) { }

        /* extra properties */
        const functionKind = region.getKindName();

        return {
            name,
            location,
            author,
            functionKind,
            identifier,
            node: region
        }
    }
}
