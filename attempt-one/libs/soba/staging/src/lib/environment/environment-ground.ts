import { startWithUndefined } from '@angular-three/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { filter, tap } from 'rxjs';
import {
  NgtSobaEnvironmentInputs,
  NgtSobaEnvironmentInputsPassThrough,
  provideNgtSobaEnvironmentInputs,
} from './environment-inputs';
import { NgtSobaEnvironmentMap } from './environment-map';
import { NgtSobaEnvironmentResolver } from './environment-resolver';
import { NgtSobaGroundProjectedEnv } from './ground-projected-env';

@Component({
  selector: 'ngt-soba-environment-ground',
  standalone: true,
  template: `
    <ng-container *ngIf="props$ | async as props">
      <ngt-soba-environment-map
        [ngtSobaEnvironmentInputsPassThrough]="this"
        [map]="props.texture"
      ></ngt-soba-environment-map>
      <ngt-soba-ground-projected-env
        [texture]="props.texture"
        [height]="props.height"
        [radius]="props.radius"
        [scale]="props.scale"
      ></ngt-soba-ground-projected-env>
    </ng-container>
  `,
  providers: [
    provideNgtSobaEnvironmentInputs(NgtSobaEnvironmentGround),
    NgtSobaEnvironmentResolver,
  ],
  imports: [
    NgtSobaEnvironmentMap,
    NgtSobaEnvironmentInputsPassThrough,
    NgtSobaGroundProjectedEnv,
    NgIf,
    AsyncPipe,
  ],
})
export class NgtSobaEnvironmentGround extends NgtSobaEnvironmentInputs {
  readonly #environmentTexture$ = inject(NgtSobaEnvironmentResolver).use(
    this.getEnvironmentResolverParams$.bind(this)
  );

  readonly #texture$ = this.select(
    this.#environmentTexture$.pipe(filter((texture) => !!texture)),
    this.select((s) => s['map']).pipe(startWithUndefined()),
    (texture, map) => map ?? texture
  ).pipe(tap(console.log.bind(console, 'texture')));

  readonly props$ = this.select(
    this.#texture$,
    this.select((s) => s['ground']),
    (texture, ground) => ({
      texture,
      height: ground?.height,
      radius: ground?.radius,
      scale: ground?.scale || 1000,
    }),
    { debounce: true }
  );
}
