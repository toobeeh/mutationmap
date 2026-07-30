import type {regionParser} from "./types/region-parser.interface.js";
import {
    type Project,
    MethodDeclaration,
    FunctionDeclaration,
    FunctionExpression,
    ArrowFunction,
    ConstructorDeclaration, GetAccessorDeclaration, SetAccessorDeclaration
} from "ts-morph";

/**
 * Node types that are considered function-like
 *
 * Easy cases: function/method/constructor declarations
 * function abc(){ }
 * private abc() { }
 * constructor() { }
 *
 * Everything else are expressions or arrow functions and have no declared name:
 * function expressions might have a name, arrow functions have no declared name
 *
 */
export type FunctionNode = MethodDeclaration | FunctionDeclaration | ConstructorDeclaration |
    GetAccessorDeclaration | SetAccessorDeclaration |
    FunctionExpression | ArrowFunction;

/**
 * Node kinds that are considered function-like
 */
export const functionNodeKinds = [
    MethodDeclaration,
    FunctionDeclaration,
    FunctionExpression,
    ConstructorDeclaration,
    GetAccessorDeclaration,
    SetAccessorDeclaration,
    ArrowFunction
];

/**
 * A region parser to detect function-like regions,
 * which are the default mutation unit regions as per specification
 */
export class FunctionRegionParser implements regionParser<FunctionNode> {

    parseRegions(project: Project): FunctionNode[] {

        /* retrieve file-level data */
        const files = project.getSourceFiles();
        const functions: FunctionNode[] = [];

        /* iterate over files and all of their nodes */
        for (const file of files) {
            file.forEachDescendant((node) => {

                /* detect function-like nodes */
                if (functionNodeKinds.some(kind => node instanceof kind)) {
                    functions.push(node as FunctionNode);
                }
            })
        }

        return functions;
    }
}
