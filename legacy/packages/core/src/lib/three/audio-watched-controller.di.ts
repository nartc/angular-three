import {
  ChangeDetectorRef,
  InjectionToken,
  Optional,
  Provider,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import { DestroyedService } from '../services/destroyed.service';
import { NgtAudioController } from './audio.controller';
import { NGT_OBJECT_3D_CONTROLLER_PROVIDER } from './object-3d-watched-controller.di';

export const NGT_AUDIO_WATCHED_CONTROLLER = new InjectionToken(
  'Watched Audio Controller'
);
export const NGT_AUDIO_CONTROLLER_PROVIDER: Provider[] = [
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  DestroyedService,
  {
    provide: NGT_AUDIO_WATCHED_CONTROLLER,
    deps: [
      [new Optional(), NgtAudioController],
      ChangeDetectorRef,
      DestroyedService,
    ],
    useFactory: audioWatchedControllerFactory,
  },
];

export function audioWatchedControllerFactory(
  controller: NgtAudioController | null,
  cdr: ChangeDetectorRef,
  destroyed: DestroyedService
) {
  if (!controller) return null;
  controller.change$.pipe(takeUntil(destroyed)).subscribe(() => {
    cdr.markForCheck();
  });
  return controller;
}
