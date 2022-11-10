import { NgtCanvas, NgtLoader, NgtStore } from '@angular-three/core';
import { NgtSphereGeometry } from '@angular-three/core/geometries';
import { NgtSpotLight } from '@angular-three/core/lights';
import { NgtMeshPhysicalMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtStats } from '@angular-three/core/stats';
import { NgtEffectComposer } from '@angular-three/postprocessing';
import { NgtLUTEffect } from '@angular-three/postprocessing/effects';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { NgtTextureLoader } from '@angular-three/soba/loaders';
import { NgtSobaEnvironment } from '@angular-three/soba/staging';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LookupTexture, LUTCubeLoader } from 'postprocessing';
import { Observable } from 'rxjs';

@Component({
  selector: 'sphere',
  standalone: true,
  template: `
    <ngt-mesh>
      <ngt-sphere-geometry [args]="[1, 64, 64]"></ngt-sphere-geometry>
      <ngt-mesh-physical-material
        [map]="texture$"
        envMapIntensity="0.4"
        clearcoat="0.8"
        clearcoatRoughness="0"
        roughness="1"
        metalness="0"
      ></ngt-mesh-physical-material>
    </ngt-mesh>
  `,
  imports: [NgtMesh, NgtSphereGeometry, NgtMeshPhysicalMaterial],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class Sphere {
  private readonly store = inject(NgtStore);
  readonly texture$ = inject(NgtTextureLoader).load(
    'assets/terrazo.png',
    this.store.select((s) => s.gl)
  );
}

@Component({
  selector: 'grading',
  standalone: true,
  template: `
    <ngt-effect-composer>
      <ngt-lut-effect [lut]="texture$"></ngt-lut-effect>
    </ngt-effect-composer>
  `,
  imports: [NgtLUTEffect, NgtEffectComposer],
})
class Grading {
  readonly texture$ = inject(NgtLoader).use(LUTCubeLoader, 'assets/cubicle-99.CUBE') as Observable<LookupTexture>;
}

@Component({
  selector: 'scene',
  standalone: true,
  template: `
    <ngt-spot-light intensity="0.5" angle="0.2" penumbra="1" [position]="[5, 15, 10]"></ngt-spot-light>

    <sphere></sphere>
    <grading></grading>
    <ngt-soba-environment preset="warehouse"></ngt-soba-environment>

    <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
  `,
  imports: [NgtSpotLight, NgtSobaEnvironment, NgtSobaOrbitControls, Sphere, Grading],
})
class Scene {}

@Component({
  selector: 'sandbox-color-grading',
  standalone: true,
  template: `
    <ngt-canvas frameloop="demand" [dpr]="[1, 2]" [camera]="{ position: [0, 0, 5], fov: 45 }">
      <scene></scene>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
        background-image: linear-gradient(-225deg, #cbbacc 0%, #2580b3 100%);
      }
    `,
  ],
  imports: [NgtCanvas, NgtStats, Scene],
})
export default class SandboxColorGrading {}
