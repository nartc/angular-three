import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import { NgtCommonAudio } from '../three/audio';
import { NGT_COMMON_AUDIO_FACTORY, NGT_COMMON_AUDIO_REF } from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideObjectFactory, provideObjectRef } from './object';

export function provideCommonAudioFactory<
    TAudioNode extends AudioNode,
    TAudio extends THREE.Audio<TAudioNode>,
    TSubAudio extends NgtCommonAudio<TAudioNode, TAudio> = NgtCommonAudio<
        TAudioNode,
        TAudio
    >
>(
    subAudioType: AnyConstructor<TSubAudio>,
    factory?: (sub: TSubAudio) => THREE.Object3D
): Provider {
    return [
        provideObjectFactory(
            subAudioType as unknown as AnyConstructor<NgtObject>,
            factory as AnyFunction
        ),
        { provide: NgtCommonAudio, useExisting: subAudioType },
        {
            provide: NGT_COMMON_AUDIO_FACTORY,
            useFactory: (subAudio: TSubAudio) => {
                return () => factory?.(subAudio) || subAudio.instance.value;
            },
            deps: [subAudioType],
        },
    ];
}

export function provideCommonAudioRef<TType extends AnyConstructor<any>>(
    subAudioType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef<THREE.Object3D>
): Provider {
    return [
        provideObjectRef(subAudioType, factory),
        { provide: NgtCommonAudio, useExisting: subAudioType },
        {
            provide: NGT_COMMON_AUDIO_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return factory?.(instance) || instance.instance;
            },
            deps: [subAudioType],
        },
    ];
}
