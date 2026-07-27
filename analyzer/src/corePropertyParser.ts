import type {attributionUnit} from "./types/attribution-unit.interface.js";
import type {propertyParser} from "./types/property-parser.interface.js";
import type {FunctionNode} from "./functionRegionParser.js";
import {
    ArrowFunction, CallExpression,
    ClassDeclaration,
    ConstructorDeclaration,
    FunctionDeclaration,
    FunctionExpression, GetAccessorDeclaration,
    MethodDeclaration, SetAccessorDeclaration,
    SyntaxKind, VariableDeclaration
} from "ts-morph";
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

    async parseProperties(_: analyzerConfig, region: FunctionNode): Promise<attributionUnit> {

        /* use different name retrieval strategies based on function kind */
        const name = region instanceof MethodDeclaration ? this.getNameFromMethodDeclaration(region) :
                region instanceof SetAccessorDeclaration ? this.getNameFromMethodDeclaration(region) :
                region instanceof GetAccessorDeclaration ? this.getNameFromMethodDeclaration(region) :
                region instanceof FunctionDeclaration ? this.getNameFromFunctionDeclaration(region) :
                region instanceof ConstructorDeclaration ? this.getNameFronConstructorDeclaration(region) :
                region instanceof FunctionExpression ? this.getNameFromFunctionExpression(region) :
                region instanceof ArrowFunction ? this.getNameFromArrowFunction(region) :
                "Unknown";

        const gitBlame = await this.getGitBlameForRegion(region);
        const author = gitBlame !== undefined ? this.getAuthorFromGitBlame(gitBlame) : undefined;
        const location = {
            file: region.getSourceFile().getBaseName(),
            startLine: region.getStartLineNumber(),
            endLine: region.getEndLineNumber()
        }
        const nodeKind = region.getKindName();

        return {
            identifier: name,
            location,
            author: author ?? "Unknown"
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

    /**
     * Retrieve the name of a function declaration, including its class name if applicable.
     *
     * Function declarations are the common case.
     *
     * function declaration example:
     * function myFunction() { }
     *
     * @param fn
     * @protected
     */
    protected getNameFromFunctionDeclaration(fn: FunctionDeclaration): string {
        const ancestorClass = fn.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration);
        const className = ancestorClass !== undefined ? (ancestorClass as FunctionDeclaration).getName() : undefined;
        let fnName = fn.getName();

        /* function declarations require a name */
        if(fnName === undefined) {
            console.warn("FunctionDeclaration unexpectedly has no name, defaulting to 'Unknown'");
            fnName = "Unknown";
        }

        return className === undefined ? fnName : `${className}.${fnName}`;
    }

    /**
     * Retrieve the name of a method declaration, including its class name if applicable.
     *
     * Method declarations are functions declared within a class.
     *
     * method declaration example:
     * class MyClass {
     *     myMethod() { }
     *  }
     *
     * @param method
     * @protected
     */
    protected getNameFromMethodDeclaration(method: MethodDeclaration | GetAccessorDeclaration | SetAccessorDeclaration): string {
        const ancestorClass = method.getFirstAncestorByKind(SyntaxKind.ClassDeclaration);
        const className = ancestorClass !== undefined ? (ancestorClass as ClassDeclaration).getName() : undefined;
        const methodName = method.getName();
        return className === undefined ? methodName : `${className}.${methodName}`;
    }

    /**
     * Retrieve the name of a constructor declaration, including its class name if applicable.
     *
     * Constructor declarations are special methods within a class that are called when creating an instance of the class.
     *
     * constructor declaration example:
     * class MyClass {
     *     constructor() { }
     *  }
     *
     * @param constructor
     * @protected
     */
    protected getNameFronConstructorDeclaration(constructor: ConstructorDeclaration): string {
        const ancestorClass = constructor.getFirstAncestorByKind(SyntaxKind.ClassDeclaration);
        const className = ancestorClass !== undefined ? (ancestorClass as ClassDeclaration).getName() : undefined;
        return className === undefined ? "Unknown" : `${className}.constructor`;
    }

    /**
     * Retrieve the name of a function expression, including its class name if applicable.
     *
     * Function expressions are functions that are assigned to a variable or passed as an argument,
     * but may not have a name themselves.
     *
     * function expression example:
     * const myFunction = function() { }
     * const myFunction = function abc() { }
     * addEventListener('click', function() { })
     * addEventListener('click', function abc() { })
     *
     * @param fn
     * @protected
     */
    protected getNameFromFunctionExpression(fn: FunctionExpression): string {
        const ancestorClass = fn.getFirstAncestorByKind(SyntaxKind.ClassDeclaration);
        const className = ancestorClass !== undefined ? (ancestorClass as ClassDeclaration).getName() : undefined;
        let fnName = fn.getName();

        /* function expressions may not have a name - anonymous or assigned to variable */
        if(fnName === undefined) {

            /* try to get assigned name, if declaration */
            const parent = fn.getParent();
            if(parent instanceof VariableDeclaration) {
                fnName = parent.getName();
            }

            /* try to get calling function */
            if(parent instanceof CallExpression){
                fnName = `${parent.getExpression().getText()}.argument`; /* TODO improve details */
            }
        }

        return className === undefined ? fnName + "" : `${className}.${fnName}`;
    }

    /**
     * Retrieve the name of an arrow function, including its class name if applicable.
     *
     * Arrow functions are a concise way to write functions, but do not have a name themselves
     *
     * arrow function example:
     * const arrow = () => { }
     * addEventListener('click', () => { })
     *
     * @param fn
     * @protected
     */
    protected getNameFromArrowFunction(fn: ArrowFunction): string {
        const ancestorClass = fn.getFirstAncestorByKind(SyntaxKind.ClassDeclaration);
        const className = ancestorClass !== undefined ? (ancestorClass as ClassDeclaration).getName() : undefined;
        let fnName = "Anonymous";

        /* try to get assigned name, if declaration */
        const parent = fn.getParent();
        if(parent instanceof VariableDeclaration) {
            fnName = parent.getName();
        }

        /* try to get calling function */
        if(parent instanceof CallExpression){
            fnName = `${parent.getExpression().getText()}.argument`; /* TODO improve details */
        }

        return className === undefined ? fnName + "" : `${className}.${fnName}`;
    }
}
