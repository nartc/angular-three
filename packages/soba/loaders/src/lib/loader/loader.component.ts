import { EnhancedRxState } from '@angular-three/core';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgModule,
  ViewChild,
} from '@angular/core';
import {
  cancelAnimationFrame,
  requestAnimationFrame,
} from '@rx-angular/cdk/zone-less';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, map, timer } from 'rxjs';
import { NgtSobaProgress } from '../progress/progress.service';

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
      <div
        *ngIf="vm.shown"
        class="container"
        [style.opacity]="vm.active ? 1 : 0"
        [class]="vm.containerClass"
      >
        <div>
          <div class="inner" [class]="vm.innerContainerClass">
            <div
              class="bar"
              [class]="vm.barClass"
              [style.transform]="'scaleX(' + vm.progress / 100 + ')'"
            ></div>
            <span #progressSpan class="data" [class]="vm.dataClass"></span>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    // language=SCSS
    `
      .container {
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

      .inner {
        width: 100px;
        height: 3px;
        background: #272727;
        text-align: center;
      }

      .bar {
        height: 3px;
        width: 100%;
        background: white;
        transition: transform 200ms;
        transform-origin: left center;
      }

      .data {
        display: inline-block;
        position: relative;
        font-variant-numeric: tabular-nums;
        margin-top: 0.8em;
        color: #f0f0f0;
        font-size: 0.6em;
        font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI',
          'Helvetica Neue', Helvetica, Arial, Roboto, Ubuntu, sans-serif,
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        white-space: nowrap;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtSobaProgress],
})
export class NgtSobaLoader
  extends EnhancedRxState<NgtSobaLoaderState>
  implements AfterViewInit
{
  readonly vm$ = combineLatest([
    this.select(),
    this.sobaProgress.select(selectSlice(['active', 'progress'])),
  ]).pipe(
    map(([state, { progress, active }]) => ({
      shown: state.shown,
      containerClass: state.loaderConfig.containerClass,
      innerContainerClass: state.loaderConfig.innerContainerClass,
      barClass: state.loaderConfig.barClass,
      dataClass: state.loaderConfig.dataClass,
      progress,
      active,
    }))
  );

  #initShown$ = combineLatest([
    this.select('shown'),
    this.sobaProgress.select('active'),
  ]).pipe(map(([shown, active]) => ({ shown, active })));

  #progress$ = combineLatest([
    this.select('loaderConfig', 'dataInterpolation'),
    this.sobaProgress.select('progress'),
  ]).pipe(
    map(([dataInterpolation, progress]) => ({ dataInterpolation, progress }))
  );

  @ViewChild('progressSpan') progressSpan?: ElementRef<HTMLSpanElement>;

  #progress = 0;

  constructor(private sobaProgress: NgtSobaProgress) {
    super();
    this.set({
      shown: sobaProgress.get('active'),
      loaderConfig: {
        dataInterpolation: (value: number) => `Loading ${value.toFixed(2)}%`,
      },
    });

    this.holdEffect(this.#initShown$, ({ shown, active }) => {
      if (shown !== active) {
        const timer$ = timer(300).subscribe(() => this.set({ shown: active }));
        return timer$.unsubscribe.bind(timer$);
      }
      return undefined;
    });
  }

  ngAfterViewInit() {
    this.holdEffect(this.#progress$, ({ progress, dataInterpolation }) => {
      let raf: ReturnType<typeof requestAnimationFrame>;

      const updateProgress = () => {
        if (this.progressSpan) {
          this.#progress += (progress - this.#progress) / 2;
          if (this.#progress > 0.95 * progress || progress === 100)
            this.#progress = progress;
          this.progressSpan.nativeElement.innerText =
            dataInterpolation?.(this.#progress) || '';

          if (this.#progress < progress)
            raf = requestAnimationFrame(updateProgress);
        }
      };

      updateProgress();

      return () => {
        if (raf) {
          cancelAnimationFrame(raf);
        }
      };
    });
  }
}

@NgModule({
  declarations: [NgtSobaLoader],
  exports: [NgtSobaLoader],
  imports: [CommonModule],
})
export class NgtSobaLoaderModule {}
