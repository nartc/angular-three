import { InjectionToken, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import { NgtCommonAudio } from '../three/audio';
import type { AnyConstructor } from '../types';
import { provideObjectFactory } from './object';

export const NGT_COMMON_AUDIO_FACTORY = new InjectionToken(
    'NgtCommonAudio factory'
);

export function provideCommonAudioFactory<TSubAudio extends NgtCommonAudio>(
    subAudioType: AnyConstructor<TSubAudio>,
    factory?: (sub: TSubAudio) => THREE.Object3D
): Provider {
    return [
        provideObjectFactory(
            subAudioType as unknown as AnyConstructor<NgtObject>
        ),
        { provide: NgtCommonAudio, useExisting: subAudioType },
        {
            provide: NGT_COMMON_AUDIO_FACTORY,
            useFactory: (subAudio: TSubAudio) => {
                return () => factory?.(subAudio) || subAudio.object3d;
            },
            deps: [subAudioType],
        },
    ];
}
