import {
  NgtCanvas,
  NgtEvent,
  NgtObjectPassThrough,
  NgtObjectProps,
  NgtPiPipe,
  NgtRadianPipe,
  provideObjectHostRef,
  Ref,
} from '@angular-three/core';
import { NgtValueAttribute } from '@angular-three/core/attributes';
import { NgtGroup } from '@angular-three/core/group';
import { NgtHemisphereLight, NgtSpotLight } from '@angular-three/core/lights';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtStats } from '@angular-three/core/stats';
import { NgtSobaOrbitControls, NgtSobaTransformControls } from '@angular-three/soba/controls';
import { NgtGLTFLoader } from '@angular-three/soba/loaders';
import {
  NgtSobaBounds,
  NgtSobaBoundsApi,
  NgtSobaBoundsContent,
  NgtSobaContactShadows,
} from '@angular-three/soba/staging';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, pipe, switchMap, tap } from 'rxjs';
import * as THREE from 'three';

const MODES = ['translate', 'rotate', 'scale'];

@Component({
  selector: 'model',
  template: `
    <ng-container *ngIf="modelRef | async as model">
      <ngt-soba-transform-controls [object]="(object$ | async)!" [mode]="(mode$ | async)!">
        <ngt-mesh
          [ngtObjectPassThrough]="this"
          [geometry]="model.geometry"
          [material]="model.material"
          [dispose]="null"
        >
          <ngt-value
            [attach]="['material', 'emissive']"
            [value]="(isCurrent$ | async) ? '#ff6080' : 'white'"
          ></ngt-value>
          <ngt-value [attach]="['material', 'roughness']" [value]="1"></ngt-value>
        </ngt-mesh>
      </ngt-soba-transform-controls>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectHostRef(Model)],
  standalone: true,
  imports: [AsyncPipe, NgIf, NgtMesh, NgtObjectPassThrough, NgtValueAttribute, NgtSobaTransformControls],
})
export class Model extends NgtObjectProps<THREE.Mesh> {
  modelRef = new Ref<THREE.Mesh>();
  private readonly stateService = inject(StateService);
  isCurrent$ = this.stateService.currentName.pipe(map((name) => name === this.get((s) => s.name)));
  object$ = this.stateService.currentName.pipe(
    filter((name) => !!name),
    switchMap((name) => this.store.select((s) => s.scene.getObjectByName(name)))
  );
  mode$ = this.stateService.currentMode.pipe(map((mode) => MODES[mode]));
  private readonly gltfLoader = inject(NgtGLTFLoader);

  private readonly loadModel = this.effect(
    pipe(
      switchMap(() => this.gltfLoader.load('assets/compressed.glb')),
      tap(({ nodes }) => {
        const name = this.get((s) => s.name);
        this.modelRef.set(nodes[name] as THREE.Mesh);
      })
    )
  );

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadModel(this.select((s) => s.name));
  }
}

@Injectable()
export class StateService {
  private currentName$ = new BehaviorSubject<string>('');
  private currentMode$ = new BehaviorSubject<number>(0);

  get currentName() {
    return this.currentName$.asObservable();
  }

  get currentMode() {
    return this.currentMode$.asObservable();
  }

  get currentModeSnapshot() {
    return this.currentMode$.getValue();
  }

  updateCurrentName(value: string) {
    this.currentName$.next(value);
  }

  updateCurrentMode(value: number) {
    this.currentMode$.next(value);
  }
}

@Component({
  selector: 'transform',
  template: `
    <ngt-spot-light [position]="[100, 100, 100]" intensity="0.8"></ngt-spot-light>

    <ngt-hemisphere-light
      color="white"
      groundColor="#b9b9b9"
      [position]="[-7, 25, 13]"
      intensity="0.85"
    ></ngt-hemisphere-light>
    <ngt-soba-bounds>
      <ng-template ngt-soba-bounds-content let-api="api">
        <ngt-group (click)="onGroupClick($event, api)" (pointermissed)="onPointerMissed($event, api)">
          <model name="Curly" [position]="[1, -11, -20]" [rotation]="[2, 0, -0]"></model>
          <model name="DNA" [position]="[20, 0, -17]" [rotation]="[1, 1, -2]"></model>
          <model name="Headphones" [position]="[20, 2, 4]" [rotation]="[1, 0, -1]"></model>
          <model name="Notebook" [position]="[-21, -15, -13]" [rotation]="[2, 0, 1]"></model>
          <model name="Rocket003" [position]="[18, 15, -25]" [rotation]="[1, 1, 0]"></model>
          <model name="Roundcube001" [position]="[-25, -4, 5]" [rotation]="[1, 0, 0]" [scale]="0.5"></model>
          <model name="Table" [position]="[1, -4, -28]" [rotation]="[1, 0, -1]" [scale]="0.5"></model>
          <model name="VR_Headset" [position]="[7, -15, 28]" [rotation]="[1, 0, -1]" [scale]="5"></model>
          <model name="Zeppelin" [position]="[-20, 10, 10]" [rotation]="[3, -1, 3]" [scale]="0.005"></model>
        </ngt-group>
      </ng-template>
    </ngt-soba-bounds>

    <ngt-soba-contact-shadows [position]="[0, -35, 0]" opacity="1" width="200" height="200" blur="1" far="50">
      <ngt-value [attach]="['rotation', 'x']" [value]="90 | radian"></ngt-value>
    </ngt-soba-contact-shadows>

    <ngt-soba-orbit-controls makeDefault minPolarAngle="0" [maxPolarAngle]="1.75 | pi"></ngt-soba-orbit-controls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgtGroup,
    NgtSpotLight,
    NgtHemisphereLight,
    NgtSobaBounds,
    NgtSobaBoundsContent,
    NgtSobaOrbitControls,
    NgtSobaContactShadows,
    NgtValueAttribute,
    NgtRadianPipe,
    NgtPiPipe,
    Model,
  ],
  providers: [StateService],
})
export class Transform {
  private readonly stateService = inject(StateService);
  onGroupClick(event: NgtEvent<MouseEvent>, api: NgtSobaBoundsApi) {
    event.stopPropagation();
    this.stateService.updateCurrentName(event.object.name);
    this.stateService.updateCurrentMode((this.stateService.currentModeSnapshot + 1) % MODES.length);
  }

  onPointerMissed(event: NgtEvent<PointerEvent>, api: NgtSobaBoundsApi) {
    this.stateService.updateCurrentName('');
  }
}

@Component({
  selector: 'transform-sandbox',
  template: `
    <ngt-canvas shadows initialLog [camera]="{ position: [0, -10, 100], fov: 50 }">
      <transform></transform>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
  `,
  standalone: true,
  imports: [NgtCanvas, NgtStats, Transform],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransformSandBox {}
