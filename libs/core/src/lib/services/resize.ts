import { DOCUMENT } from '@angular/common';
import { ElementRef, Inject, Injectable, NgZone } from '@angular/core';
import {
    debounceTime,
    fromEvent,
    MonoTypeOperatorFunction,
    Observable,
    pipe,
    ReplaySubject,
    share,
    Subject,
    takeUntil,
} from 'rxjs';
import {
    NGT_RESIZE_OBSERVER_SUPPORT,
    NGT_RESIZE_OPTIONS,
    NgtResizeOptions,
} from '../di/resize';
import { WINDOW } from '../di/window';

export interface NgtResizeResult {
    readonly entries: ReadonlyArray<ResizeObserverEntry>;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly left: number;
    readonly dpr: number;
}

@Injectable()
export class NgtResize extends Observable<NgtResizeResult> {
    constructor(
        @Inject(ElementRef) { nativeElement }: ElementRef<Element>,
        @Inject(NgZone) zone: NgZone,
        @Inject(DOCUMENT) document: Document,
        @Inject(WINDOW) window: Window,
        @Inject(NGT_RESIZE_OBSERVER_SUPPORT) isSupport: boolean,
        @Inject(NGT_RESIZE_OPTIONS)
        { box, offsetSize, scroll, debounce }: NgtResizeOptions
    ) {
        let observer: ResizeObserver;
        let lastBounds: Omit<NgtResizeResult, 'entries' | 'dpr'>;
        let lastEntries: ResizeObserverEntry[] = [];

        const torndown$ = new Subject<void>();
        const scrollContainers: HTMLOrSVGElement[] | null =
            findScrollContainers(nativeElement as HTMLElement);

        // set actual debounce values early, so effects know if they should react accordingly
        const scrollDebounce = debounce
            ? typeof debounce === 'number'
                ? debounce
                : debounce.scroll
            : null;

        const resizeDebounce = debounce
            ? typeof debounce === 'number'
                ? debounce
                : debounce.resize
            : null;

        const debounceAndDestroy = <T>(
            debounce: number | null
        ): MonoTypeOperatorFunction<T> => {
            return pipe(debounceTime(debounce ?? 0), takeUntil(torndown$));
        };

        super((subscriber) => {
            if (!isSupport) {
                subscriber.error(
                    'ResizeObserver is not supported in your browser. Please use a polyfill'
                );
                return;
            }

            zone.runOutsideAngular(() => {
                const callback = (entries: ResizeObserverEntry[]) => {
                    lastEntries = entries;
                    const { left, top, width, height, bottom, right, x, y } =
                        nativeElement.getBoundingClientRect() as unknown as Omit<
                            NgtResizeResult,
                            'entries'
                        >;

                    const size = {
                        left,
                        top,
                        width,
                        height,
                        bottom,
                        right,
                        x,
                        y,
                    };

                    if (nativeElement instanceof HTMLElement && offsetSize) {
                        size.height = nativeElement.offsetHeight;
                        size.width = nativeElement.offsetWidth;
                    }

                    Object.freeze(size);
                    subscriber.next({
                        entries,
                        dpr: window.devicePixelRatio,
                        ...size,
                    });
                    if (!areBoundsEqual(lastBounds || {}, size)) {
                        lastBounds = size;
                    }
                };

                const boundEntriesCallback = () => {
                    callback(lastEntries);
                };

                observer = new ResizeObserver(callback);
                observer.observe(nativeElement, { box });
                if (scroll) {
                    if (scrollContainers) {
                        scrollContainers.forEach((scrollContainer) => {
                            fromEvent(
                                scrollContainer as HTMLElement,
                                'scroll',
                                {
                                    capture: true,
                                    passive: true,
                                }
                            )
                                .pipe(debounceAndDestroy(scrollDebounce))
                                .subscribe(boundEntriesCallback);
                        });
                    }

                    fromEvent(window, 'scroll', {
                        capture: true,
                        passive: true,
                    })
                        .pipe(debounceAndDestroy(scrollDebounce))
                        .subscribe(boundEntriesCallback);
                }

                fromEvent(window, 'resize')
                    .pipe(debounceAndDestroy(resizeDebounce))
                    .subscribe(boundEntriesCallback);
            });

            return () => {
                if (observer) {
                    observer.unobserve(nativeElement);
                    observer.disconnect();
                }
                torndown$.next();
                torndown$.complete();
            };
        });

        return this.pipe(
            debounceTime(scrollDebounce || 0),
            share({
                connector: () => new ReplaySubject(1),
                resetOnRefCountZero: true,
                resetOnComplete: true,
            })
        );
    }
}

// Returns a list of scroll offsets
function findScrollContainers(
    element: HTMLOrSVGElement | null
): HTMLOrSVGElement[] {
    const result: HTMLOrSVGElement[] = [];
    if (!element || element === document.body) return result;
    const { overflow, overflowX, overflowY } = window.getComputedStyle(
        element as HTMLElement
    );
    if (
        [overflow, overflowX, overflowY].some(
            (prop) => prop === 'auto' || prop === 'scroll'
        )
    )
        result.push(element);
    return [
        ...result,
        ...findScrollContainers((element as HTMLElement).parentElement),
    ];
}

// Checks if element boundaries are equal
const keys: (keyof Omit<NgtResizeResult, 'entries' | 'dpr'>)[] = [
    'x',
    'y',
    'top',
    'bottom',
    'left',
    'right',
    'width',
    'height',
];
const areBoundsEqual = (
    a: Omit<NgtResizeResult, 'entries' | 'dpr'>,
    b: Omit<NgtResizeResult, 'entries' | 'dpr'>
): boolean => keys.every((key) => a[key] === b[key]);
