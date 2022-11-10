import { NgtComponentStore, skipFirstUndefined, tapEffect } from '@angular-three/core';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  ViewChild,
} from '@angular/core';
import { timer } from 'rxjs';
import { NgtSobaProgress } from '../progress/progress';

interface NgtSobaLoaderState {
  shown: boolean;
  loaderConfig: {
    containerClass?: string;
    innerContainerClass?: string;
    barClass?: string;
    dataClass?: string;
    dataInterpolation?: (value: number) => string;
  };
}

@Component({
  selector: 'ngt-soba-loader',
  standalone: true,
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <div
        *ngIf="vm['shown']"
        class="loader-container"
        [style.opacity]="vm.active ? 1 : 0"
        [class]="vm['containerClass']"
      >
        <div>
          <div class="inner-loader" [class]="vm['innerContainerClass']">
            <div
              class="inner-loader-bar"
              [class]="vm['barClass']"
              [style.transform]="'scaleX(' + vm.progress / 100 + ')'"
            ></div>
            <span #progressSpan class="inner-loader-data" [class]="vm['dataClass']"></span>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  imports: [NgIf, AsyncPipe],
  styles: [
    // language=SCSS
    `
      .loader-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #171717;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 300ms ease;
        z-index: 1000;
      }

      .inner-loader {
        width: 100px;
        height: 3px;
        background: #272727;
        text-align: center;
      }

      .inner-loader-bar {
        height: 3px;
        width: 100%;
        background: white;
        transition: transform 200ms;
        transform-origin: left center;
      }

      .inner-loader-data {
        display: inline-block;
        position: relative;
        font-variant-numeric: tabular-nums;
        margin-top: 0.8em;
        color: #f0f0f0;
        font-size: 0.6em;
        font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, Roboto,
          Ubuntu, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        white-space: nowrap;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaLoader extends NgtComponentStore<NgtSobaLoaderState> implements AfterViewInit {
  private readonly sobaProgress = inject(NgtSobaProgress);
  private readonly zone = inject(NgZone);

  readonly vm$ = this.select(
    this.select((s) => s.shown).pipe(skipFirstUndefined()),
    this.select((s) => s.loaderConfig).pipe(skipFirstUndefined()),
    this.sobaProgress.select((s) => s.active),
    this.sobaProgress.select((s) => s.progress),
    (shown, { dataClass, barClass, containerClass, innerContainerClass }, active, progress) => ({
      shown,
      containerClass,
      innerContainerClass,
      dataClass,
      barClass,
      active,
      progress,
    }),
    { debounce: true }
  );

  @ViewChild('progressSpan') progressSpan?: ElementRef<HTMLSpanElement>;

  private _progress = 0;

  private readonly setShown = this.effect(
    tapEffect(() => {
      const shown = this.getState((s) => s.shown);
      const active = this.sobaProgress.getState((s) => s.active);

      if (shown !== active) {
        const sub = timer(300).subscribe(() => {
          this.zone.run(() => {
            this.set({ shown: active });
          });
        });

        return sub.unsubscribe.bind(sub);
      }
    })
  );

  private readonly setProgress = this.effect(
    tapEffect(() => {
      const dataInterpolation = this.getState((s) => s.loaderConfig.dataInterpolation);
      const progress = this.sobaProgress.getState((s) => s.progress);

      let rafId: ReturnType<typeof requestAnimationFrame>;

      const updateProgress = () => {
        if (this.progressSpan) {
          this._progress += (progress - this._progress) / 2;
          if (this._progress > 0.95 * progress || progress === 100) this._progress = progress;
          this.progressSpan.nativeElement.innerText = dataInterpolation?.(this._progress) || '';

          if (this._progress < progress) rafId = requestAnimationFrame(updateProgress);
        }
      };

      updateProgress();

      return () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    })
  );

  ngAfterViewInit() {
    this.set({
      shown: this.sobaProgress.getState((s) => s.active),
      loaderConfig: {
        dataInterpolation: (value: number) => `Loading ${value.toFixed(2)}%`,
      },
    });

    this.zone.runOutsideAngular(() => {
      this.setShown(
        this.select(
          this.select((s) => s.shown),
          this.sobaProgress.select((s) => s.active),
          this.defaultProjector,
          { debounce: true }
        )
      );
      this.setProgress(
        this.select(
          this.select((s) => s.loaderConfig),
          this.sobaProgress.select((s) => s.progress),
          this.defaultProjector,
          { debounce: true }
        )
      );
    });
  }
}
