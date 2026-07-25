import type {attributionUnit} from "./types/attribution.unit.js";
import type {propertyParser} from "./types/property-parser.interface.js";
import type {FunctionNode} from "./functionRegionParser.js";

/**
 * A property parser fore core attribution unit properties as per specification
 */
export class CorePropertyParser implements propertyParser<attributionUnit, FunctionNode> {

    parseProperties(path: string, region: FunctionNode): attributionUnit {

        const name = path;
        const author = "";
        const location = region.getKindName() ?? "";

        return {
            name,
            author,
            location
        }
    }
}
