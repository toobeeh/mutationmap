import {mutationEvent} from "@/content/observer.ts";

export default class MutationComponent extends HTMLElement {

    private _userOpened = false;

    constructor(private readonly _event: mutationEvent, private readonly _defaultOpen = false) {
        super();
        this.attachShadow({mode:'open'});
    }

    public get mutationId() {
        return this._event.mutation.id;
    }

    public get userOpened() {
        return this._userOpened;
    }

    public open() {
        const details = this.shadowRoot?.querySelector("details");
        if(details) {
            details.open = true;
        }
    }

    public close() {
        const details = this.shadowRoot?.querySelector("details");
        if(details) {
            details.open = false;
        }
    }

    connectedCallback(){

        const unit = this._event.unit;
        const mutation = this._event.mutation;

        if(this.shadowRoot) this.shadowRoot.innerHTML = `

            <style>
                small {
                    padding-top: .2rem;
                }
                
                #name {
                    color: #c1c4ff;
                }
                
                #type {
                    color: #de7e52;
                }
                
                #mutation {
                    display: contents;
                }
                
                details[open] summary {
                    margin-bottom: .5rem;
                }
                
                details[open] {
                    border-bottom: 1px solid dimgray;
                }
                
                summary {
                    cursor: pointer;
                    user-select: none;
                }
                
                .properties {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    column-gap: .5rem;
                    margin-top: .5rem;
                    margin-bottom: .5rem;
                }
                
                .properties .header {
                    grid-column: 1 / -1;
                    margin-bottom: .2rem;
                    opacity: .7;
                }
                
                .properties .name {
                    color: #7cacf8;
                    padding-left: .5rem;
                }
            </style>

            <div id="mutation">
                <small>${new Date(mutation.date).toLocaleTimeString()}</small>
                <details ${this._defaultOpen ? "open" : ""}>
                    <summary><span id="name">${unit.name}</span> @ <span id="type">${mutation.type}</span></summary>
                    
                    <div class="properties">
                        <span class="header">Attribution Unit</span>
                        <span class="name">Name</span> <span>${unit.name}</span>
                        <span class="name">Author</span> <span>${unit.author}</span>
                        <span class="name">Kind</span> <span>${unit.functionKind}</span>
                        <span class="name">Location</span> <span>${unit.location.file} #${unit.location.startLine}-${unit.location.endLine}</span>
                    </div>
                    
                    <div class="properties">
                        <span class="header">DOM Mutation</span>
                        
                        <span class="name">Target</span> <span>${mutation.target}</span>
                        <span class="name">Type</span> <span>${mutation.type}</span>
                        
                        ${
                            mutation.type === "attributes" ||  mutation.type === "characterData" ? `
                                <span class="name">Old value</span> <span>${mutation.oldValue}</span>
                                <span class="name">New value</span> <span>${mutation.newValue}</div>
                            ` : `
                                <span class="name">Removed nodes</span> <span>${mutation.removedNodes?.join(", ")}</span>
                                <span class="name">Added nodes</span> <span>${mutation.addedNodes?.join(", ")}</span>
                            `
                        }
                    </div>
                </details>
            </div>
        `;

        /* set to dirty once manually toggled */
        const details = this.shadowRoot?.querySelector("details");
        if(details) {
            details.addEventListener("click", () => {
                this._userOpened = true;
            }, {once: true});
        }
    }
}
