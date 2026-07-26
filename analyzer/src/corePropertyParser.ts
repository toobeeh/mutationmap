import type {attributionUnit} from "./types/attribution-unit.interface.js";
import type {propertyParser} from "./types/property-parser.interface.js";
import type {FunctionNode} from "./functionRegionParser.js";
import {ClassDeclaration, FunctionDeclaration, MethodDeclaration, ts} from "ts-morph";
import SyntaxKind = ts.SyntaxKind;

/**
 * A property parser fore core attribution unit properties as per specification
 */
export class CorePropertyParser implements propertyParser<attributionUnit, FunctionNode> {

    parseProperties(path: string, region: FunctionNode): attributionUnit {

        const name =
            region instanceof MethodDeclaration ? this.getNameFromMethodDeclaration(region) :
                region instanceof FunctionDeclaration ? this.getNameFromFunctionDeclaration(region) :
                path;

        const author = "";
        const location = `${region.getSourceFile().getBaseName()} #${region.getStartLineNumber()}-${region.getEndLineNumber()}`;
        const nodeKind = region.getKindName();

        return {
            name,
            author,
            location,
            nodeKind
        }
    }

    private getNameFromMethodDeclaration(method: MethodDeclaration): string {
        const ancestorClass = method.getFirstAncestorByKind(SyntaxKind.ClassDeclaration);
        const className = ancestorClass !== undefined ? (ancestorClass as ClassDeclaration).getName() : undefined;
        const methodName = method.getName();
        return className === undefined ? methodName : `${className}.${methodName}`;
    }

    private getNameFromFunctionDeclaration(fn: FunctionDeclaration): string {
        const ancestorClass = fn.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration);
        const className = ancestorClass !== undefined ? (ancestorClass as FunctionDeclaration).getName() : undefined;
        const fnName = fn.getName();
        return className === undefined ? fnName + "" : `${className}.${fnName}`;
    }
}
