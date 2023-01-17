import { ChangeDetectorRef, ElementRef, ViewRef } from '@angular/core';
import {
    BehaviorSubject,
    distinctUntilChanged,
    filter,
    map,
    merge,
    Observable,
    of,
    Subscription,
    switchMap,
    takeUntil,
} from 'rxjs';
import { NgtAnyRecord, NgtInstanceNode } from '../types';
import { getLocalState } from '../utils/instance';
import { is } from '../utils/is';
import { injectNgtDestroy } from './destroy';

type Subscribe<T> = (callbacK: (current: T, previous: T | null) => void) => Subscription;

export type NgtInjectedRef<T> = ElementRef<T> & {
    subscribe: Subscribe<T>;
    $: Observable<T>;
    children$: (childType?: 'objects' | 'nonObjects' | 'both') => Observable<NgtInstanceNode[]>;
    useCD: (cdr: ChangeDetectorRef) => void;
};

export function injectNgtRef<T>(initialValue: ElementRef<T> | (T | null) = null): NgtInjectedRef<T> {
    let ref = new ElementRef<T>(initialValue as T);
    if (is.ref(initialValue)) {
        ref = initialValue;
    }

    let lastValue = ref.nativeElement;
    const cdRefs = [] as ChangeDetectorRef[];
    const ref$ = new BehaviorSubject<T>(lastValue);

    const [destroy$, cdr] = injectNgtDestroy(() => {
        ref$.complete();
    });

    cdRefs.push(cdr);

    const obs$ = ref$.asObservable().pipe(distinctUntilChanged(), takeUntil(destroy$));

    const subscribe: Subscribe<T> = (callback) => {
        return obs$.subscribe((current) => {
            callback(current, lastValue);
            lastValue = current;
        });
    };

    const $ = obs$.pipe(
        filter((s) => !!s),
        takeUntil(destroy$)
    );

    const children$ = (childType: 'objects' | 'nonObjects' | 'both' = 'objects') =>
        $.pipe(
            switchMap((instance) => {
                const localState = getLocalState(instance as object);
                if (localState) {
                    return merge(localState.objects, localState.nonObjects).pipe(
                        map(() =>
                            childType === 'both'
                                ? [...localState.objects.value, ...localState.nonObjects.value]
                                : localState[childType].value
                        )
                    );
                }
                return of([]);
            }),
            filter((children) => children.length > 0),
            takeUntil(destroy$)
        );

    Object.defineProperty(ref, 'nativeElement', {
        set: (newVal: T) => {
            if (ref.nativeElement !== newVal) {
                ref$.next(newVal);
                const cds = [...cdRefs];
                for (let i = 0; i < cds.length; i++) {
                    const cd = cds[i];
                    if ((cd as ViewRef).destroyed) {
                        cdRefs.splice(i, 1);
                        continue;
                    }
                    try {
                        // during creation phase, 'context' on ViewRef will be null
                        // we check the "context" to avoid running detectChanges during this phase.
                        // becuase there's nothing to check
                        if ((cd as NgtAnyRecord)['context']) {
                            cd.detectChanges();
                        }
                    } catch (e) {
                        cd.markForCheck();
                    }
                }
                lastValue = ref.nativeElement;
                ref.nativeElement = newVal;
            }
        },
        get: () => ref$.value,
    });

    return Object.assign(ref, {
        get subscribe() {
            return subscribe;
        },
        get $() {
            return $;
        },
        get children$() {
            return children$;
        },
        useCD: (cdr: ChangeDetectorRef) => void cdRefs.push(cdr),
    });
}
