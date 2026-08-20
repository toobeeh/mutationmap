import type {instrumentationAttributionUnit} from "./types/instrumentationAttributionUnit.interface.js";
import * as crypto from "crypto";
import {Block} from "ts-morph";

export interface instrumentationAttributionUnitEvent {
    name: string;
    location: instrumentationAttributionUnit["location"];
    identifier: instrumentationAttributionUnit["identifier"];
    functionKind: string;
    author: string;
}

export class InstrumentationTranspiler {

    constructor(readonly handlerModuleId: string) {}

    private parsedUnits: Map<string, instrumentationAttributionUnit[]> = new Map();

    /**
     * Instruments a source code file of given attribution units.
     * Instrumented code contains a call to the instrumentation handler.
     * If the initializer flag is set, the index and handler will be initialized in this source code chunk as well.
     * @param units
     * @param id
     */
    public transpileToInstrumentedUnits(units: instrumentationAttributionUnit[], id: string): string {

        if(units.length === 0){
            throw new Error("No attribution units provided for file");
        }

        const fileHash = crypto.createHash('md5').update(id).digest('hex');

        /* traverse reverse, so that nodes parents are not edited (forgotten) before their child references are used*/
        let index = 0;
        for(const unit of units.reverse()){

            let body = unit.node.getBody();
            if(body !== undefined) {

                /* normalize to block scopes to insert statement before region - update new body reference */
                if(!(body instanceof Block)){
                    body = body.replaceWithText(`{return ${body.getText()};}`);
                }

                /* call instrumentation handler */
                (body as Block).insertStatements(0,
                    `mutationmap.handle("${fileHash}#${index++}");`
                );
            }
        }

        /* add units to file index */
        this.parsedUnits.set(fileHash, units);

        /* import virtual module at top */
        const sourceFile = units[0]!.node.getSourceFile();
        sourceFile.insertStatements(0, `
            import * as mutationmap from "${this.handlerModuleId}";
            mutationmap.register("${fileHash}", ${JSON.stringify(units.map(unit => this.simplifyUnit(unit)))});
        `);

        return sourceFile.getText();
    }

    /**
     * Get the index of parsed units, which can be used by the instrumentation handler to dispatch events for each unit.
     * The index is a map of file hashes to arrays of simplified attribution units.
     */
    public getUnitIndex() {
        const index: {[key: string]: instrumentationAttributionUnitEvent[]} = {};
        this.parsedUnits.forEach((units, fileHash) => {
            index[fileHash] = units.map(unit => this.simplifyUnit(unit));
        });

        return index;
    }

    /**
     * Clear the internal index of parsed units.
     */
    public clearUnitIndex() {
        this.parsedUnits = new Map();
    }

    /**
     * Simplify a unit to a plain object that can be used in js source code.
     * @param unit
     * @private
     */
    private simplifyUnit(unit: instrumentationAttributionUnit): instrumentationAttributionUnitEvent {
        return {
            name: unit.name,
            location: unit.location,
            identifier: unit.identifier,
            functionKind: unit.functionKind,
            author: unit.author
        } as instrumentationAttributionUnitEvent;
    }
}
