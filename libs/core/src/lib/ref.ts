import { BehaviorSubject, Observable } from 'rxjs';

export class Ref<TValue = any> {
    private readonly _ref: BehaviorSubject<TValue>;

    constructor(value: TValue | null = null) {
        this._ref = new BehaviorSubject<TValue>(value!);
    }

    get ref$(): Observable<TValue> {
        return this._ref.asObservable();
    }

    get value(): TValue {
        return this._ref.getValue();
    }

    set(value: TValue) {
        this._ref.next(value);
    }

    complete() {
        this._ref.complete();
    }
}
