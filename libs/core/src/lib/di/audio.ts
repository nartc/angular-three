import { Provider } from '@angular/core';
import * as THREE from 'three';
import { Ref } from '../ref';
import { NgtCommonAudio } from '../three/audio';
import { NGT_COMMON_AUDIO_REF } from '../tokens';
import type { AnyConstructor } from '../types';
import { provideObjectRef } from './object';

export function provideCommonAudioRef<TType extends AnyConstructor<any>>(
  subAudioType: TType,
  factory?: (instance: InstanceType<TType>) => Ref<THREE.Object3D>
): Provider {
  return [
    provideObjectRef(subAudioType, factory),
    { provide: NgtCommonAudio, useExisting: subAudioType },
    {
      provide: NGT_COMMON_AUDIO_REF,
      useFactory: (instance: InstanceType<TType>) => {
        return () => factory?.(instance) || instance.instance;
      },
      deps: [subAudioType],
    },
  ];
}
