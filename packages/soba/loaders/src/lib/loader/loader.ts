import { NgtPush, NgtRxStore, startWithUndefined } from '@angular-three/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, map, of, switchMap, timer, withLatestFrom } from 'rxjs';
import { injectNgtsProgress } from '../progress/progress';

const defaultDataInterpolation = (p: number) => `Loading ${p.toFixed(2)}%`;

@Component({
    selector: 'ngts-loader',
    standalone: true,
    template: `
        <ng-container *ngIf="vm$ | ngtPush as vm">
            <div
                *ngIf="vm.shown"
                class="ngts-loader-container"
                [class]="vm.containerClass"
                [style.--ngts-loader-container-opacity]="vm.active ? 1 : 0"
            >
                <div>
                    <div class="ngts-loader-inner" [class]="vm.innerClass">
                        <div
                            class="ngts-loader-bar"
                            [class]="vm.barClass"
                            [style.--ngts-loader-bar-scale]="vm.progress / 100"
                        ></div>
                        <span #progressSpanRef class="ngts-loader-data" [class]="vm.dataClass"></span>
                    </div>
                </div>
            </div>
        </ng-container>
    `,
    styleUrls: ['loader.css'],
    imports: [NgIf, AsyncPipe, NgtPush],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtsLoader extends NgtRxStore implements OnInit {
    readonly #progress = injectNgtsProgress();

    readonly vm$ = combineLatest([
        this.select('shown'),
        this.select('containerClass').pipe(startWithUndefined()),
        this.select('innerClass').pipe(startWithUndefined()),
        this.select('barClass').pipe(startWithUndefined()),
        this.select('dataClass').pipe(startWithUndefined()),
        this.#progress.select(selectSlice(['progress', 'active'])),
    ]).pipe(
        map(([shown, containerClass, innerClass, barClass, dataClass, { progress, active }]) => {
            return { shown, containerClass, innerClass, barClass, dataClass, progress, active };
        })
    );

    @Input() set containerClass(containerClass: string) {
        this.set({ containerClass });
    }

    @Input() set innerClass(innerClass: string) {
        this.set({ innerClass });
    }

    @Input() set barClass(barClass: string) {
        this.set({ barClass });
    }

    @Input() set dataClass(dataClass: string) {
        this.set({ dataClass });
    }

    @Input() set dataInterpolation(dataInterpolation: (value: number) => string) {
        this.set({
            dataInterpolation: dataInterpolation === undefined ? this.get('dataInterpolation') : dataInterpolation,
        });
    }

    @Input() set initialState(initialState: (value: boolean) => boolean) {
        this.set({ initialState: initialState === undefined ? this.get('initialState') : initialState });
    }

    @ViewChild('progressSpanRef') progressSpanRef?: ElementRef<HTMLSpanElement>;

    override initialize(): void {
        super.initialize();
        this.set({
            dataInterpolation: defaultDataInterpolation,
            initialState: (active: boolean) => active,
        });
    }

    ngOnInit() {
        this.set({ shown: this.get('initialState')(this.#progress.get('active')) });
        this.connect(
            'shown',
            this.#progress.select('active').pipe(
                withLatestFrom(this.select('shown')),
                switchMap(([active, shown]) => {
                    if (shown !== active) return timer(300).pipe(map(() => active));
                    return of(shown);
                })
            )
        );

        let progressRef = 0;
        let rafId: ReturnType<typeof requestAnimationFrame>;

        this.effect(
            combineLatest([this.select('dataInterpolation'), this.#progress.select('progress')]),
            ([dataInterpolation, progress]) => {
                const updateProgress = () => {
                    if (!this.progressSpanRef?.nativeElement) return;
                    progressRef += (progress - progressRef) / 2;
                    if (progressRef > 0.95 * progress || progress === 100) progressRef = progress;
                    this.progressSpanRef.nativeElement.innerText = dataInterpolation(progressRef);
                    if (progressRef < progress) {
                        rafId = requestAnimationFrame(updateProgress);
                    }
                };

                updateProgress();

                return () => cancelAnimationFrame(rafId);
            }
        );
    }
}
