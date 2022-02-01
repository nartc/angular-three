import {
  NgtStore,
  RafId,
  zonelessCancelAnimationFrame,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
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
import { selectSlice } from '@rx-angular/state';
import { combineLatest, map, timer } from 'rxjs';
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
  extends NgtStore<NgtSobaLoaderState>
  implements AfterViewInit
{
  readonly vm$ = combineLatest([
    this.select(),
    this.sobaProgress.select(selectSlice(['active', 'progress'])),
  ]).pipe(
    map(([{ loaderConfig, shown }, { progress, active }]) => ({
      shown,
      containerClass: loaderConfig.containerClass,
      innerContainerClass: loaderConfig.innerContainerClass,
      barClass: loaderConfig.barClass,
      dataClass: loaderConfig.dataClass,
      progress,
      active,
    }))
  );

  private initShown$ = combineLatest([
    this.select('shown'),
    this.sobaProgress.select('active'),
  ]).pipe(map(([shown, active]) => ({ shown, active })));

  private progress$ = combineLatest([
    this.select('loaderConfig', 'dataInterpolation'),
    this.sobaProgress.select('progress'),
  ]).pipe(
    map(([dataInterpolation, progress]) => ({ dataInterpolation, progress }))
  );

  @ViewChild('progressSpan') progressSpan?: ElementRef<HTMLSpanElement>;

  private _progress = 0;

  constructor(private sobaProgress: NgtSobaProgress, private zone: NgZone) {
    super();
    this.set({
      shown: sobaProgress.get('active'),
      loaderConfig: {
        dataInterpolation: (value: number) => `Loading ${value.toFixed(2)}%`,
      },
    });
  }

  ngAfterViewInit() {
    zonelessRequestAnimationFrame(() => {
      this.effect(this.initShown$, ({ shown, active }) => {
        if (shown !== active) {
          const timer$ = timer(300).subscribe(() =>
            this.set({ shown: active })
          );
          return timer$.unsubscribe.bind(timer$);
        }
        return undefined;
      });

      this.effect(this.progress$, ({ progress, dataInterpolation }) => {
        let raf: RafId;

        const updateProgress = () => {
          if (this.progressSpan) {
            this._progress += (progress - this._progress) / 2;
            if (this._progress > 0.95 * progress || progress === 100)
              this._progress = progress;
            this.progressSpan.nativeElement.innerText =
              dataInterpolation?.(this._progress) || '';

            if (this._progress < progress)
              raf = zonelessRequestAnimationFrame(updateProgress);
          }
        };

        updateProgress();

        return () => {
          if (raf) {
            zonelessCancelAnimationFrame(raf);
          }
        };
      });
    });
  }
}

@NgModule({
  declarations: [NgtSobaLoader],
  exports: [NgtSobaLoader],
  imports: [CommonModule],
})
export class NgtSobaLoaderModule {}
