import { NgtComponentStore, tapEffect } from '@angular-three/core';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgModule,
  NgZone,
  ViewChild,
} from '@angular/core';
import { Observable, timer } from 'rxjs';
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
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <div *ngIf="vm.shown" class="loader-container" [style.opacity]="vm.active ? 1 : 0" [class]="vm.containerClass">
        <div>
          <div class="inner-loader" [class]="vm.innerContainerClass">
            <div
              class="inner-loader-bar"
              [class]="vm.barClass"
              [style.transform]="'scaleX(' + vm.progress / 100 + ')'"
            ></div>
            <span #progressSpan class="inner-loader-data" [class]="vm.dataClass"></span>
          </div>
        </div>
      </div>
    </ng-container>
  `,
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
  providers: [NgtSobaProgress],
})
export class NgtSobaLoader extends NgtComponentStore<NgtSobaLoaderState> implements AfterViewInit {
  readonly vm$: Observable<{
    shown: boolean;
    containerClass: string | undefined;
    innerContainerClass: string | undefined;
    dataClass: string | undefined;
    barClass: string | undefined;
    active: boolean;
    progress: number;
  }> = this.select(
    this.select((s) => s.shown),
    this.select((s) => s.loaderConfig),
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
    })
  );

  private initShown$ = this.select(
    this.select((s) => s.shown),
    this.sobaProgress.select((s) => s.active),
    (shown, active) => ({ shown, active })
  );

  private progress$ = this.select(
    this.select((s) => s.loaderConfig.dataInterpolation),
    this.sobaProgress.select((s) => s.progress),
    (dataInterpolation, progress) => ({ dataInterpolation, progress })
  );

  @ViewChild('progressSpan') progressSpan?: ElementRef<HTMLSpanElement>;

  private _progress = 0;

  constructor(private sobaProgress: NgtSobaProgress, private zone: NgZone) {
    super();
    this.set({
      shown: sobaProgress.get((s) => s.active),
      loaderConfig: {
        dataInterpolation: (value: number) => `Loading ${value.toFixed(2)}%`,
      },
    });
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.setShown(this.initShown$);
      this.setProgress(this.progress$);
    });
  }

  private readonly setShown = this.effect<{
    shown: boolean;
    active: boolean;
  }>(
    tapEffect(({ shown, active }) => {
      if (shown !== active) {
        const sub = timer(300).subscribe(() => {
          this.set({ shown: active });
        });

        return sub.unsubscribe.bind(sub);
      }
      return;
    })
  );

  private readonly setProgress = this.effect<{
    progress: number;
    dataInterpolation: NgtSobaLoaderState['loaderConfig']['dataInterpolation'];
  }>(
    tapEffect(({ progress, dataInterpolation }) => {
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
}

@NgModule({
  declarations: [NgtSobaLoader],
  exports: [NgtSobaLoader],
  imports: [CommonModule],
})
export class NgtSobaLoaderModule {}
