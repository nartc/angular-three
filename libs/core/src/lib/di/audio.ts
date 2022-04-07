import { InjectionToken, Provider } from '@angular/core';
import { NgtObject } from '../abstracts/object';
import { NgtCommonAudio } from '../three/audio';
import type { AnyConstructor } from '../types';
import { provideObjectFactory } from './object';

export const NGT_COMMON_AUDIO_FACTORY = new InjectionToken(
    'NgtCommonAudio factory'
);

export function provideCommonAudioFactory<TSubAudio extends NgtCommonAudio>(
    subAudioType: AnyConstructor<TSubAudio>
): Provider {
    return [
        provideObjectFactory(
            subAudioType as unknown as AnyConstructor<NgtObject>
        ),
        { provide: NgtCommonAudio, useExisting: subAudioType },
        {
            provide: NGT_COMMON_AUDIO_FACTORY,
            useFactory: (subAudio: TSubAudio) => {
                return () => subAudio.object;
            },
            deps: [subAudioType],
        },
    ];
}
