import { injectNgtRef, NgtAnyRecord, NgtArgs, NgtRxStore } from '@angular-three/core';
import { injectNgtpEffectComposertApi } from '@angular-three/postprocessing';
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
import { BlendFunction, SSAOEffect } from 'postprocessing';
import { combineLatest, map, startWith } from 'rxjs';

@Component({
    selector: 'ngtp-ssao',
    standalone: true,
    template: ` <ngt-primitive *args="[get('effect')]" [ref]="ssaoRef" /> `,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    inputs: [
        'blendFunction',
        'distanceScaling',
        'depthAwareUpsampling',
        'normalDepthBuffer',
        'samples',
        'rings',
        'worldDistanceThreshold',
        'worldDistanceFalloff',
        'worldProximityThreshold',
        'worldProximityFalloff',
        'distanceThreshold',
        'distanceFalloff',
        'rangeThreshold',
        'rangeFalloff',
        'minRadiusScale',
        'luminanceInfluence',
        'radius',
        'intensity',
        'bias',
        'fade',
        'color',
        'resolutionScale',
        'resolutionX',
        'resolutionY',
        'width',
        'height',
    ],
})
export class NgtpSSAO
    extends NgtRxStore<NonNullable<ConstructorParameters<typeof SSAOEffect>[2]>>
    implements OnInit, OnChanges
{
    readonly #composerApi = injectNgtpEffectComposertApi();

    @Input() ssaoRef = injectNgtRef<SSAOEffect>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['ssaoRef']) {
            delete changes['ssaoRef'];
        }
        this.set((s) => ({
            ...s,
            ...Object.entries(changes).reduce((props, [key, change]) => {
                props[key] = change.currentValue;
                return props;
            }, {} as NgtAnyRecord),
        }));
    }

    ngOnInit() {
        const inputs =
            reflectComponentType(this.constructor as Type<any>)
                ?.inputs.filter((input) => input.propName !== 'ssaoRef')
                .map((input) => input.propName) || [];
        this.connect(
            'effect',
            combineLatest([
                this.#composerApi.select('entities'),
                this.#composerApi.select('activeCamera'),
                this.select(
                    selectSlice(inputs),
                    startWith({
                        blendFunction: BlendFunction.MULTIPLY,
                        samples: 30,
                        rings: 4,
                        distanceThreshold: 1.0,
                        distanceFalloff: 0.0,
                        rangeThreshold: 0.5,
                        rangeFalloff: 0.1,
                        luminanceInfluence: 0.9,
                        radius: 20,
                        scale: 0.5,
                        bias: 0.5,
                        intensity: 1.0,
                        color: null,
                        depthAwareUpsampling: true,
                    })
                ),
            ]).pipe(
                map(([[normalPass, downSamplingPass], camera, props]) => {
                    const { resolutionScale } = this.#composerApi;
                    return new SSAOEffect(camera, normalPass && !downSamplingPass ? normalPass.texture : null, {
                        normalDepthBuffer: downSamplingPass ? downSamplingPass.texture : null,
                        resolutionScale: resolutionScale ?? 1,
                        ...props,
                    } as ConstructorParameters<typeof SSAOEffect>[2]);
                })
            )
        );
    }
}
