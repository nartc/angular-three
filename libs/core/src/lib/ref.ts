import { BehaviorSubject, Observable } from 'rxjs';

export class Ref<TValue> {
    private readonly _ref: BehaviorSubject<TValue>;

    constructor(value: TValue | null = null) {
        this._ref = new BehaviorSubject<TValue>(value!);
    }

    get ref(): () => TValue {
        return this._ref.getValue.bind(this._ref);
    }

    get ref$(): Observable<TValue> {
        return this._ref.asObservable();
    }

    get value(): TValue {
        return this.ref();
    }

    set(value: TValue) {
        this._ref.next(value);
    }

    complete() {
        this._ref.complete();
    }
}
