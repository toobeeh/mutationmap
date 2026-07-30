import {instrumentationAttributionUnitEvent} from "mutationmap-transpiler/dist/transpiler.ts";

export interface mutationEvent {
    mutation: simpleMutation;
    unit: instrumentationAttributionUnitEvent;
}

export interface simpleMutation {
    type: MutationRecordType;
    oldValue: string | null;
    newValue: string | null;
    attributeName: string | null;
    removedNodes: string[] | null;
    addedNodes: string[] | null;
    date: number;
    id: number;
}

export class Observer {

    private _nodeHistory: WeakMap<Node, mutationEvent[]> = new WeakMap();
    private readonly _mutationObserver: MutationObserver;
    private _currentUnit?: object;
    private _mutationObservers: MutationObserver[] = [];
    private readonly _unitEventhandler = this.processUnitEvent.bind(this) as EventListener;
    private readonly _backgroundPort = chrome.runtime.connect({
        name: "content"
    });
    private _mutationId = 0;

    constructor() {
        this._mutationObserver = this.createObserver();
    }

    /**
     * Start observing the document for mutations and shadow doms.
     * Any mutation will be linked to the current attribution unit and recorded as history.
     */
    public observe() {

        /* disconnect from previous tasks */
        this._nodeHistory = new WeakMap();
        this._mutationObservers.forEach(observer => observer.disconnect());
        this._mutationObservers = [];
        document.removeEventListener("attributionUnitEntered", this._unitEventhandler);

        /* start observing on root; root observer starts shadow dom observers */
        this.observeElement(document.body, this._mutationObserver);
        document.body.querySelectorAll("*").forEach((element) => {
            if (element.shadowRoot !== null) {
                this.observeElement(element.shadowRoot, this.createObserver());
            }
        });
        document.addEventListener("attributionUnitEntered", this._unitEventhandler);
    }

    /**
     * Get the history of mutations for a specific node.
     * @param node
     */
    public getHistoryForNode(node: Node): mutationEvent[] | undefined {
        return this._nodeHistory.get(node);
    }

    /**
     * Get the full history of all nodes that have been mutated.
     */
    public getHistory() {
        return this._nodeHistory;
    }

    /**
     * Create a mutation observer that recursively listens on newly added shadow doms
     * to capture the full dom tree.
     * Any mutation is added to the node history, if a mutation unit is currently set.
     * @private
     */
    private createObserver() {
        return new MutationObserver(mutations => {
            const unit = this._currentUnit;

            for (const mutation of mutations) {

                /* detect new shadow doms */
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element && node.shadowRoot !== null) {
                        this.observeElement(node.shadowRoot, this.createObserver());
                    }
                }

                /* log mutation */
                if(unit) {
                    let history = this._nodeHistory.get(mutation.target);
                    history = history ?? [];
                    history.push({mutation: this.simplifyMutation(mutation), unit: structuredClone(unit) as instrumentationAttributionUnitEvent});
                    this._nodeHistory.set(mutation.target, history);
                }
            }

            /* notify debugger that changes happened */
            this._backgroundPort.postMessage({
                type: "mutation"
            });
        });
    }

    /**
     * Start observing a specific element or shadow root for mutations.
     * @param element
     * @param observer
     * @private
     */
    private observeElement(element: HTMLElement | ShadowRoot, observer: MutationObserver) {
       observer.observe(element, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
       this._mutationObservers.push(observer);
    }

    /**
     * Process an attribution unit event from instrumented code
     * and store the current unit for future mutations.
     * @param event
     * @private
     */
    private processUnitEvent(event: CustomEvent) {
        if(typeof event.detail === "object") {
            this._currentUnit = structuredClone(event.detail as object);
        }
        else this._currentUnit = undefined;
    }

    /**
     * Simplify a mutation record to serializable object
     * @param mutation
     * @private
     */
    private simplifyMutation(mutation: MutationRecord): simpleMutation {

        let newValue = null;
        if(mutation.type === "attributes" && mutation.target instanceof Element) {
            newValue = mutation.target.getAttribute(mutation.attributeName ?? "");
        }
        if(mutation.type === "characterData" && mutation.target instanceof Element) {
            newValue = mutation.target.textContent;
        }

        return {
            date: Date.now(),
            type: mutation.type,
            oldValue: mutation.oldValue,
            newValue,
            attributeName: mutation.attributeName,
            removedNodes: Array.from(mutation.removedNodes).map(node => node.nodeName),
            addedNodes: Array.from(mutation.addedNodes).map(node => node.nodeName),
            id: this._mutationId++
        }
    }
}
