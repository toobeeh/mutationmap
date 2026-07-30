import {mutationEvent} from "@/content/observer.ts";
import MutationComponent from "@/components/mutation.component.ts";

export default class DebuggerComponent extends HTMLElement {

    constructor(){
        super();
        this.attachShadow({mode:'open'});
    }

    public set log(log: mutationEvent[]) {
        const logComponent = this.shadowRoot?.querySelector("#log") ?? undefined;
        if(logComponent) {
            const logItems = logComponent.querySelectorAll<MutationComponent>("mutationmap-mutation");
            const lastId = Math.max(...[...logItems].map(item => item.mutationId));

            /* only select newer mutations, ordered ascending */
            const newer = log
                .filter(event => event.mutation.id > lastId)
                .sort((a,b) => a.mutation.id - b.mutation.id);
            const maxId = Math.max(...newer.map(event => event.mutation.id));

            /* if user has not interacted, close all items and open the latest */
            const userInteracted = [...logItems].some(item => item.userOpened);
            if(!userInteracted) {
                logItems.forEach(item => item.close());
            }

            /* append new elements */
            newer.forEach(mutation => {
                const mutationComponent = new MutationComponent(mutation, !userInteracted && mutation.mutation.id === maxId);
                logComponent.insertAdjacentElement("afterbegin", mutationComponent);
            });

            /* remove items that are no longer present */
            logItems.forEach(item => {
                if(!log.some(event => event.mutation.id === item.mutationId)) {
                    item.remove();
                }
            });
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
                
                #title {
                    font-family: system-ui;
                    padding: .3rem;
                    border-bottom: 1px solid grey;
                    position: sticky;
                    top: 0;
                    background: #434465;
                    z-index: 10;
                }
            </style>
            <div id="title">Mutations caused by attribution units in instrumented code</div>
            <div id="log"></div>
        `;
    }
}
