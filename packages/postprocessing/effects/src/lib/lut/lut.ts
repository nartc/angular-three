import {
    injectNgtRef,
    injectNgtStore,
    NgtAnyRecord,
    NgtArgs,
    NgtRxStore,
    startWithUndefined,
} from '@angular-three/core';
import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    Input,
    OnChanges,
    OnInit,
    reflectComponentType,
    SimpleChanges,
    Type,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { LUT3DEffect } from 'postprocessing';
import { combineLatest, map, startWith } from 'rxjs';
import { Texture } from 'three';

@Component({
    selector: 'ngtp-lut',
    standalone: true,
    template: `<ngt-primitive *args="[get('effect')]" [ref]="lutRef" />`,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    inputs: ['blendFunction', 'tetrahedralInterpolation'],
})
export class NgtpLUT extends NgtRxStore implements OnInit, OnChanges {
    readonly #store = injectNgtStore();

    @Input() lutRef = injectNgtRef<LUT3DEffect>();

    @Input() set lut(lut: Texture) {
        this.set({ lut });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['lutRef']) {
            delete changes['lutRef'];
        }
        if (changes['lut']) {
            delete changes['lut'];
        }
        this.set((s) => ({
            ...s,
            ...Object.entries(changes).reduce((props, [key, change]) => {
                props[key] = change.currentValue;
                return props;
            }, {} as NgtAnyRecord),
        }));
    }

    ngOnInit(): void {
        const inputs =
            reflectComponentType(this.constructor as Type<any>)
                ?.inputs.filter((input) => input.propName !== 'lutRef' && input.propName !== 'lut')
                .map((input) => input.propName) || [];
        this.connect(
            'effect',
            combineLatest([this.select('lut'), this.select(selectSlice(inputs), startWith({}))]).pipe(
                map(([lut, props]) => new LUT3DEffect(lut, props))
            )
        );
        this.hold(
            combineLatest([
                this.select('lut'),
                this.select('effect'),
                this.select('tetrahedralInterpolation').pipe(startWithUndefined()),
            ]),
            ([lut, effect, tetrahedralInterpolation]) => {
                const invalidate = this.#store.get('invalidate');
                if (lut) effect.lut = lut;
                if (tetrahedralInterpolation) effect.tetrahedralInterpolation = tetrahedralInterpolation;
                invalidate();
            }
        );
    }
}
