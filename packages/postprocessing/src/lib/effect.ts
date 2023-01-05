import {
  injectNgtStore,
  NgtAnyConstructor,
  NgtRxStore,
  startWithUndefined,
} from '@angular-three/core';
import { Directive, Input, OnInit } from '@angular/core';
import { BlendFunction, Effect } from 'postprocessing';
import { combineLatest } from 'rxjs';

@Directive()
export abstract class NgtpEffect<T extends NgtAnyConstructor<Effect>>
  extends NgtRxStore
  implements OnInit
{
  @Input() set blendFunction(blendFunction: BlendFunction) {
    this.set({ blendFunction });
  }

  @Input() set opacity(opacity: number) {
    this.set({ opacity });
  }

  @Input() set args(args: ConstructorParameters<T>[0]) {
    this.set({ args });
  }

  abstract get effectConstructor(): T;

  protected defaultBlendMode = BlendFunction.NORMAL;
  protected readonly store = injectNgtStore();

  ngOnInit() {
    this.connect(
      'effect',
      this.select(['args'], ({ args }) => new this.effectConstructor(...args))
    );

    this.#configureBlendMode();
  }

  #configureBlendMode() {
    this.hold(
      combineLatest([
        this.select('effect'),
        this.select('blendFunction').pipe(startWithUndefined()),
        this.select('opacity').pipe(startWithUndefined()),
      ]),
      ([effect, blendFunction, opacity]) => {
        const invalidate = this.store.get('invalidate');
        effect.blendMode.blendFunction =
          !blendFunction && blendFunction !== 0 ? this.defaultBlendMode : blendFunction;
        if (opacity !== undefined) effect.blendMode.opacity.value = opacity;
        invalidate();
      }
    );
  }
}
