import type {instrumentationAttributionUnit} from "./types/instrumentationAttributionUnit.interface.js";
import * as crypto from "crypto";

export class InstrumentationTranspiler {

    private parsedUnits: Map<string, instrumentationAttributionUnit[]> = new Map();

    /**
     * Instruments a source code file of given attribution units.
     * Instrumented code contains a call to the instrumentation handler.
     * If the initializer flag is set, the index and handler will be initialized in this source code chunk as well.
     * @param units
     * @param id
     * @param appendIndexInitializer handy for vite dev mode, when not all files are loaded at once
     */
    public transpileToInstrumentedUnits(units: instrumentationAttributionUnit[], id: string, appendIndexInitializer = false): string {

        if(units.length === 0){
            throw new Error("No attribution units provided for file");
        }

        const fileHash = crypto.createHash('md5').update(id).digest('hex');

        let index = 0;
        for(const unit of units){
            unit.node.insertStatements(0,
                `window.__logUnitEntered("${fileHash}",${index++});`
            );
        }

        this.parsedUnits.set(fileHash, units);

        const sourceFile = units[0]!.node.getSourceFile();
        if(appendIndexInitializer){
            const indexInitializer = this.createUnitIndexInitializer(fileHash);
            sourceFile.insertStatements(0, indexInitializer);
        }

        return sourceFile.getText();
    }

    /**
     * Clear the internal index of parsed units.
     */
    public clearUnitIndex() {
        this.parsedUnits = new Map();
    }

    /**
     * Create js source code that initializes a page-global index
     * and instrumentation handler for untis that are captured until now,
     * or only for a specific file if idHash is provided.
     * @param idHash
     */
    public createUnitIndexInitializer(idHash?: string) {

        const filtered = Array
            .from(this.parsedUnits.entries())
            .filter(([key]) => key === idHash || idHash === undefined)
            .filter(([, value]) => value.length > 0);

        const contentSetters = filtered.map(([key, value]) => {
            const plainUnitArrayContent = this.stringifyUnits(value);
            return `window.__attributionUnitIndex.set("${key}",${plainUnitArrayContent});`;
        });

        return `
        window.__logUnitEntered = window.__dispatchUnitEntered ?? ((fileHash, index) => {
            window.__currentAttributionUnit = window.__attributionUnitIndex.get(fileHash)[index];
            document.dispatchEvent(new CustomEvent("attributionUnitEntered", { detail: window.__attributionUnitIndex.get(fileHash)[index] }))
        });
        window.__attributionUnitIndex = window.__attributionUnitIndex ?? new Map();
        ${contentSetters.join("\n")}
        `;
    }

    /**
     * Stringify the units to a plain array of objects that can be used in js source code.
     * @param units
     * @private
     */
    private stringifyUnits(units: instrumentationAttributionUnit[]): string {
        return JSON.stringify(units.map(unit => ({
            name: unit.name,
            location: unit.location,
            identifier: unit.identifier,
            kind: unit.functionKind,
            author: unit.author
        })));
    }


}
