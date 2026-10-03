import {Service, signal} from '@angular/core';
import {Session} from 'wordle-lib';

@Service()
export class SessionService {
    private _session = signal<undefined | Session>(undefined);
    public readonly current = this._session.asReadonly();

    create(username: string) {
        this._session.set(new Session(username));
    }
}
