import {mutationEvent} from "@/content/observer.ts";
import MutationComponent from "@/components/mutation.component.ts";

export default class DebuggerComponent extends HTMLElement {

    constructor(){
        super();
        this.attachShadow({mode:'open'});
    }

    /**
     *
     * @param log most recent last
     */
    public set log(log: mutationEvent[]) {
        const logComponent = this.shadowRoot?.querySelector("#log") ?? undefined;
        if(logComponent) {
            const existingEvents = [...logComponent.querySelectorAll<MutationComponent>("mutationmap-mutation")];
            const userInteracted = existingEvents.some(item => item.userOpened);

            /* remove items that are no longer present */
            const presentEvents: MutationComponent[] = [];
            existingEvents.forEach(item => {
                if(!log.some(event => event.mutation.id === item.mutationId)) {
                    item.remove();
                }
                else presentEvents.push(item);
            });
            const lastExistingId = Math.max(...presentEvents.map(item => item.mutationId));

            /* only select newer or missing mutations, ordered from new to old */
            const newEvents = log
                .filter(event => event.mutation.id > lastExistingId || !existingEvents.some(item => item.mutationId === event.mutation.id))
                .sort((a, b) => b.mutation.id - a.mutation.id);
            const lastNewId = Math.max(lastExistingId, ...newEvents.map(event => event.mutation.id));

            /* append new elements in correct order */
            newEvents.forEach(mutation => {
                const mutationComponent = new MutationComponent(mutation, !userInteracted && mutation.mutation.id === lastNewId);

                /* find first existing that is older */
                const insertPosition = presentEvents.find(item => item.mutationId < mutation.mutation.id);

                /* if none older, add at end */
                if(insertPosition === undefined) {
                    logComponent.insertAdjacentElement("beforeend", mutationComponent);
                }
                /* else add before older */
                else {
                    insertPosition.insertAdjacentElement("beforebegin", mutationComponent);
                }
            });

            /* if user has not interacted, close all items and open the latest */
            if(!userInteracted) {
                presentEvents.forEach(item => {
                    if(item.mutationId !== lastNewId) {
                        item.close();
                    }
                });
            }
        }
    }

    connectedCallback(){
        if(this.shadowRoot) this.shadowRoot.innerHTML = `

            <style>
                #log {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    column-gap: 1rem;
                    row-gap: .5rem;
                    padding: .5rem;
                }
                
                #log:empty:before {
                    content: "Selected element has no recorded mutations.";
                    opacity: .8;
                    font-style: italic;
                }
                
                mutationmap-mutation {
                    display: contents;
                }
            </style>
            
            <div id="log"></div>
        `;
    }
}
