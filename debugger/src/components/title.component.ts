export default class TitleComponent extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode:'open'});
    }

    connectedCallback(){
        if(this.shadowRoot) this.shadowRoot.innerHTML = `

            <style>
                #title {
                    font-family: system-ui;
                    padding: .3rem;
                    border-bottom: 1px solid grey;
                    background: #434465;
                }
            </style>
            
            <div id="title">Mutations caused by attribution units in instrumented code</div>
        `;
    }
}
