import {EventEmitter} from "./eventEmitter.ts";

export interface route {
    component?: string;
    path: string;
    guard?: () => boolean | string;
}

export class Router {

    private readonly routes: Map<string, route> = new Map<string, route>();
    private readonly routedEvent: EventEmitter<string | undefined> = new EventEmitter<string | undefined>();

    public readonly onRouted = this.routedEvent.readonlyEmitter;

    public addRoute(route: route) {
        if(this.routes.has(route.path)){
            throw new Error(`Route with path ${route.path} already exists`);
        }

        this.routes.set(route.path, route);
    }

    private processRoute(path: string) {
        const route = this.routes.get(path);
        if(route) {
            const guardResult = route.guard?.() ?? true;
            if(guardResult === true) {
                this.routedEvent.emit(route.component);
            }
            else if(guardResult === false) {
                console.warn(`Could not navigate to route ${path} due to guard returning false`);
            } else {
                window.location.hash = guardResult as string;
            }
        } else {
            console.warn(`No route found for path ${path}`);
        }
    }

    public observe() {
        window.addEventListener('hashchange', () => {
            let path = window.location.hash.substring(1);
            if(path === "") path = "/";
            this.processRoute(path);
        });

        let initialPath = window.location.hash.substring(1);
        if(initialPath === "") initialPath = "/";
        this.processRoute(initialPath);
    }
}
