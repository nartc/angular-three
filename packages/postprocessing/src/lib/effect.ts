import { injectNgtStore, NgtAnyConstructor, NgtRxStore, startWithUndefined } from '@angular-three/core';
import { Directive, Input, OnChanges, OnInit, reflectComponentType, SimpleChanges, Type } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { BlendFunction, Effect } from 'postprocessing';
import { combineLatest, startWith } from 'rxjs';

@Directive()
export abstract class NgtpEffect<T extends Effect> extends NgtRxStore implements OnInit, OnChanges {
    @Input() set blendFunction(blendFunction: BlendFunction) {
        this.set({ blendFunction });
    }

    @Input() set opacity(opacity: number) {
        this.set({ opacity });
    }

    abstract get effectConstructor(): NgtAnyConstructor<T>;

    protected defaultBlendMode = BlendFunction.NORMAL;
    protected readonly store = injectNgtStore();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['opacity']) {
            delete changes['opacity'];
        }

        if (changes['blendFunction']) {
            delete changes['blendFunction'];
        }

        this.set((s) => ({
            ...s,
            ...Object.entries(changes).reduce((props, [key, change]) => {
                props[key] = change.currentValue;
                return props;
            }, {} as ConstructorParameters<NgtAnyConstructor<T>>[0]),
        }));
    }

    ngOnInit() {
        const inputs = reflectComponentType(this.constructor as Type<any>)?.inputs.map((input) => input.propName) || [];
        this.connect('effect', this.select(selectSlice(inputs), startWith(this.#startWithProps(inputs))), (props) => {
            delete props['__ngt__dummy__'];
            delete props['effect'];
            return new this.effectConstructor(props);
        });

        this.#configureBlendMode();
    }

    #startWithProps(inputs: string[]) {
        return inputs.reduce((defaultProps, key) => {
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
