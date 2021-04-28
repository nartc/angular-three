import {
  ChangeDetectorRef,
  InjectionToken,
  Optional,
  Provider,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Object3dControllerDirective } from '../controllers';
import { DestroyedService } from '../services';

export const OBJECT_3D_WATCHED_CONTROLLER = new InjectionToken(
  'Watched Object3D Controller'
);

export const OBJECT_3D_CONTROLLER_PROVIDER: Provider[] = [
  DestroyedService,
  {
    provide: OBJECT_3D_WATCHED_CONTROLLER,
    deps: [
      [new Optional(), Object3dControllerDirective],
      ChangeDetectorRef,
      DestroyedService,
    ],
    useFactory: object3dWatchedControllerFactory,
  },
];

export function object3dWatchedControllerFactory(
  controller: Object3dControllerDirective | null,
  changeDetectorRef: ChangeDetectorRef,
  destroy$: DestroyedService
) {
  if (!controller) return null;

  controller.change$.pipe(takeUntil(destroy$)).subscribe(() => {
    changeDetectorRef.markForCheck();
  });

  return controller;
}
