import {
  DestroyedService,
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import {
  ChangeDetectorRef,
  InjectionToken,
  Optional,
  Provider,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import { NgtSobaLineController } from './line.controller';

export const NGT_SOBA_LINE_WATCHED_CONTROLLER = new InjectionToken(
  'Watched Line Controller'
);

export const NGT_SOBA_LINE_CONTROLLER_PROVIDER: Provider[] = [
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  DestroyedService,
  {
    provide: NGT_SOBA_LINE_WATCHED_CONTROLLER,
    deps: [
      [new Optional(), NgtSobaLineController],
      ChangeDetectorRef,
      DestroyedService,
    ],
    useFactory: sobaLineWatchedControllerFactory,
  },
];

export function sobaLineWatchedControllerFactory(
  controller: NgtSobaLineController | null,
  cdr: ChangeDetectorRef,
  destroyed: DestroyedService
) {
  if (!controller) return null;

  controller.change$.pipe(takeUntil(destroyed)).subscribe(() => {
    cdr.markForCheck();
  });

  return controller;
}
