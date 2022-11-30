import { asyncScheduler, BehaviorSubject, filter, map, observeOn, pipe, switchMap } from 'rxjs';
import type { NgtAnyRecord } from './types';
import { getInstanceLocalState } from './utils/get-instance-local-state';

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

    objectRefs$() {
        return this.pipe(
            filter((s) => !!s),
            switchMap((s) => getInstanceLocalState(s as NgtAnyRecord)!.objectsRefs),
            this.mapToValue()
        );
    }

    instanceRefs$() {
        return this.pipe(
            filter((s) => !!s),
            switchMap((s) => getInstanceLocalState(s as NgtAnyRecord)!.instancesRefs),
            this.mapToValue()
        );
    }

    private mapToValue() {
        return pipe(
            map((objects: NgtRef[]) =>
                objects.reduce((acc, object) => {
                    if (object.value) {
                        acc.push(object.value);
                    }
                    return acc;
                }, [] as NgtAnyRecord[])
            ),
            filter((objects) => objects.length > 0),
            observeOn(asyncScheduler)
        );
    }
}
