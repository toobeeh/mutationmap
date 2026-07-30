export default class SettingsComponent extends HTMLElement {

    constructor(private _viewDescendants = false, private _onlyLatest = false) {
        super();
        this.attachShadow({mode:'open'});
    }

    public get viewDescendants() {
        return this._viewDescendants;
    }

    public set viewDescendants(value: boolean) {
        this._viewDescendants = value;
    }

    public get onlyLatest() {
        return this._onlyLatest;
    }

    public set onlyLatest(value: boolean) {
        this._onlyLatest = value;
    }

    connectedCallback(){
        if(this.shadowRoot) this.shadowRoot.innerHTML = `

            <style>
                #settings {
                    font-family: system-ui;
                    padding: .6rem .3rem;
                    border-bottom: 1px solid grey;
                    
                    display: flex;
                    gap: 1rem;
                }
                
                #settings > div {
                    display: flex;
                    align-items: center;
                    gap: .3rem;
                }
                
                label {
                    user-select: none;
                }
            </style>
            
            <div id="settings">
                <div>
                    <input type="checkbox" id="includeDescendants" name="includeDescendants" ${this._viewDescendants ? "checked" : ""}>
                    <label for="includeDescendants">Descendants</label>
                </div>
            
                <div>
                    <input type="checkbox" id="onlyLatest" name="onlyLatest" ${this._viewDescendants ? "checked" : ""}>
                    <label for="onlyLatest">Only latest mutation</label>    
                </div>
            </div>
        `;

        const includeDescendantsCheckbox = this.shadowRoot?.querySelector<HTMLInputElement>("#includeDescendants");
        if(includeDescendantsCheckbox) {
            includeDescendantsCheckbox.addEventListener("change", (event) => {
                const target = event.target as HTMLInputElement;
                this._viewDescendants = target.checked;
                this.dispatchEvent(new CustomEvent('change'));
            });
        }

        const onlyLatestCheckbox = this.shadowRoot?.querySelector<HTMLInputElement>("#onlyLatest");
        if(onlyLatestCheckbox) {
            onlyLatestCheckbox.addEventListener("change", (event) => {
                const target = event.target as HTMLInputElement;
                this._onlyLatest = target.checked;
                this.dispatchEvent(new CustomEvent('change'));
            });
        }
    }
}
