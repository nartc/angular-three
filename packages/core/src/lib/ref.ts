import { BehaviorSubject } from 'rxjs';

export class NgtRef<T = any> extends BehaviorSubject<T> {
    constructor(value?: T | null) {
        super(value ? value : null!);
    }

    set(valueOrFactory: T | ((previous: T) => T)) {
        if (typeof valueOrFactory === 'function') {
            this.next((valueOrFactory as (previous: T) => T)(this.value));
        } else {
            this.next(valueOrFactory);
        }
    }
}
