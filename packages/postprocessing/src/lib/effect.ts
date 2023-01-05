import {
  injectNgtStore,
  NgtAnyConstructor,
  NgtRxStore,
  startWithUndefined,
} from '@angular-three/core';
import { Directive, Input, OnInit } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { BlendFunction, Effect } from 'postprocessing';
import { combineLatest, startWith } from 'rxjs';

export type NgtpKeyofProps<T extends Effect> = Array<
  keyof NonNullable<ConstructorParameters<NgtAnyConstructor<T>>[0]>
>;

@Directive()
export abstract class NgtpEffect<T extends Effect> extends NgtRxStore implements OnInit {
  @Input() set blendFunction(blendFunction: BlendFunction) {
    this.set({ blendFunction });
  }

  @Input() set opacity(opacity: number) {
    this.set({ opacity });
  }

  abstract get effectConstructor(): NgtAnyConstructor<T>;
  abstract get effectPropsKeys(): NgtpKeyofProps<T>;

  protected defaultBlendMode = BlendFunction.NORMAL;
  protected readonly store = injectNgtStore();

  ngOnInit() {
    this.connect(
      'effect',
      this.select(selectSlice(this.effectPropsKeys), startWith(this.#startWithProps)),
      (props) => new this.effectConstructor(props)
    );

    this.#configureBlendMode();
  }

  #startWithProps() {
    return this.effectPropsKeys.reduce((defaultProps, key) => {
      defaultProps[key] = this.get(key);
      return defaultProps;
    }, {} as ConstructorParameters<NgtAnyConstructor<T>>[0]);
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
