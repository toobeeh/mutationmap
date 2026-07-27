export default class TestComponent extends HTMLElement {

    private readonly _button = document.createElement('button');
    private readonly _span = document.createElement('span');
    private _count = 0;

    constructor(){
        super();
        this.attachShadow({mode:'open'});
    }

    public set count(count: number) {
        this._count = count;
        this._span.textContent = `Count: ${this._count}`;
    }

    public get count(): number {
        return this._count;
    }

    connectedCallback(){
        this._button.innerHTML = "Click me";
        this._button.addEventListener("click", () => {
            this.count++;
        });
        this.count = 0;

        this.shadowRoot.append(this._button, this._span);
    }
}
