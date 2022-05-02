import { Provider } from '@angular/core';
import { Ref } from '../ref';
import { NgtCommonLight } from '../three/light';
import { NGT_COMMON_LIGHT_REF } from '../tokens';
import type { AnyConstructor } from '../types';
import { provideObjectRef } from './object';

export function provideCommonLightRef<TType extends AnyConstructor<any>>(
  subLightType: TType,
  factory?: (instance: InstanceType<TType>) => Ref
): Provider {
  return [
    provideObjectRef(subLightType, factory),
    { provide: NgtCommonLight, useExisting: subLightType },
    {
      provide: NGT_COMMON_LIGHT_REF,
      useFactory: (instance: InstanceType<TType>) => {
        return () => factory?.(instance) || instance.instance;
      },
      deps: [subLightType],
    },
  ];
}
