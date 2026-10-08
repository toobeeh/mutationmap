export class EventEmitter<TEvent> {

    private _listeners: EventListener<TEvent>[] = [];

    public get readonlyEmitter() {
        return this as ReadonlyEventEmitter<TEvent>;
    }

    public emit(event: TEvent) {
        for (const listener of this._listeners) {
            listener.callback(event);
        }
    }

    public subscribe(callback: (event: TEvent) => void): EventListener<TEvent> {
        const listener = new EventListener(this, callback);
        this._listeners.push(listener);
        return listener;
    }

    public unsubscribe(listener: EventListener<TEvent>) {
        this._listeners = this._listeners.filter(l => l !== listener);
    }
}

export class EventListener<TEvent> {

    constructor(
        private readonly emitter: EventEmitter<TEvent>,
        public readonly callback: (event: TEvent) => void = () => { }
    ) { }

    public unsubscribe() {
        this.emitter.unsubscribe(this);
    }
}

export interface ReadonlyEventEmitter<TEvent> {
    subscribe(callback: (event: TEvent) => void): EventListener<TEvent>;
}
