import {
  ChangeDetectorRef,
  InjectionToken,
  Optional,
  Provider,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import { DestroyedService } from '../services/destroyed.service';
import { NgtObject3dController } from './object-3d.controller';

export const NGT_OBJECT_3D_WATCHED_CONTROLLER = new InjectionToken(
  'Watched Object3D Controller'
);

export const NGT_OBJECT_3D_CONTROLLER_PROVIDER: Provider[] = [
  DestroyedService,
  {
    provide: NGT_OBJECT_3D_WATCHED_CONTROLLER,
    deps: [
      [new Optional(), NgtObject3dController],
      ChangeDetectorRef,
      DestroyedService,
    ],
    useFactory: object3dWatchedControllerFactory,
  },
];

export function object3dWatchedControllerFactory(
  controller: NgtObject3dController | null,
  changeDetectorRef: ChangeDetectorRef,
  destroy$: DestroyedService
) {
  if (!controller) return null;

  controller.change$.pipe(takeUntil(destroy$)).subscribe(() => {
    changeDetectorRef.markForCheck();
  });

  return controller;
}
