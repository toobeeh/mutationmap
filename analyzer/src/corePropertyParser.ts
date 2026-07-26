import type {attributionUnit} from "./types/attribution-unit.interface.js";
import type {propertyParser} from "./types/property-parser.interface.js";
import type {FunctionNode} from "./functionRegionParser.js";
import {ClassDeclaration, FunctionDeclaration, MethodDeclaration, ts} from "ts-morph";
import SyntaxKind = ts.SyntaxKind;
import type {analyzerConfig} from "./types/analyzer-config.interface.js";
import {type SimpleGit, simpleGit} from "simple-git";

/**
 * A property parser fore core attribution unit properties as per specification
 */
export class CorePropertyParser implements propertyParser<attributionUnit, FunctionNode> {

    private readonly repository?: SimpleGit;

    constructor(repoPath?: string){
        if(repoPath !== undefined) {
            this.repository = simpleGit(repoPath);
        }
    }

    async parseProperties(config: analyzerConfig, region: FunctionNode): Promise<attributionUnit> {

        const name =
            region instanceof MethodDeclaration ? this.getNameFromMethodDeclaration(region) :
                region instanceof FunctionDeclaration ? this.getNameFromFunctionDeclaration(region) :
                config.path;

        const gitBlame = await this.getGitBlameForRegion(region);
        const author = gitBlame !== undefined ? this.getAuthorFromGitBlame(gitBlame) : undefined;
        const location = `${region.getSourceFile().getBaseName()} #${region.getStartLineNumber()}-${region.getEndLineNumber()}`;
        const nodeKind = region.getKindName();

        return {
            name,
            author: author ?? "Unknown",
            location,
            nodeKind
        }
    }

    /**
     * Retrieve git blame information for a given function node
     * @param node The function node used to determine source code location
     * @returns The git blame information as a string, or undefined if the repository is not configured
     * @protected
     */
    protected async getGitBlameForRegion(node: FunctionNode): Promise<string | undefined> {

        /* check if repository has been configured, else no metadata retrieval possible */
        if(this.repository === undefined){
            return undefined;
        }

        /* retrieve file path in fs */
        const absoluteFilePath = node.getSourceFile().getFilePath();

        /* retrieve git metadata as string via git blame */
        const blame = await this.repository.raw([
            "blame",
            "--porcelain",
            "-L",
            `${node.getStartLineNumber()},${node.getEndLineNumber()}`,
            absoluteFilePath,
        ]);

        return blame;
    }

    /**
     * Extract the author from git blame information
     * @param blame The git blame information as a string
     * @returns The author name if found, otherwise undefined
     * @protected
     */
    protected getAuthorFromGitBlame(blame: string): string | undefined {
        const authorMatch = blame.match(/author (.+)/);
        if (authorMatch && authorMatch[1]) {
            return authorMatch[1].trim();
        }

        return undefined;
    }

    protected getNameFromMethodDeclaration(method: MethodDeclaration): string {
        const ancestorClass = method.getFirstAncestorByKind(SyntaxKind.ClassDeclaration);
        const className = ancestorClass !== undefined ? (ancestorClass as ClassDeclaration).getName() : undefined;
        const methodName = method.getName();
        return className === undefined ? methodName : `${className}.${methodName}`;
    }

    protected getNameFromFunctionDeclaration(fn: FunctionDeclaration): string {
        const ancestorClass = fn.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration);
        const className = ancestorClass !== undefined ? (ancestorClass as FunctionDeclaration).getName() : undefined;
        const fnName = fn.getName();
        return className === undefined ? fnName + "" : `${className}.${fnName}`;
    }
}
