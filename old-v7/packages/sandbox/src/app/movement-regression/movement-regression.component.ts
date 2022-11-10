import { NgtCanvas, NgtComponentStore, NgtRef, NgtStore, NgtVector3 } from '@angular-three/core';
import {
  NgtColorAttribute,
  NgtFogAttribute,
  NgtValueAttribute,
  NgtVector2Attribute,
} from '@angular-three/core/attributes';
import { NgtPlaneGeometry } from '@angular-three/core/geometries';
import { NgtDirectionalLight, NgtRectAreaLight, NgtSpotLight } from '@angular-three/core/lights';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtGroup, NgtMesh } from '@angular-three/core/objects';
import { NgtStats } from '@angular-three/core/stats';
import { NgtEffectComposer } from '@angular-three/postprocessing';
import { NgtBloomEffect, NgtSSAOEffect } from '@angular-three/postprocessing/effects';
import { NgtSobaText } from '@angular-three/soba/abstractions';
import { NgtGLTFLoader } from '@angular-three/soba/loaders';
import { NgtSobaAdaptiveDpr } from '@angular-three/soba/performances';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, Injectable, Input, NgZone, OnInit } from '@angular/core';
import { BlendFunction } from 'postprocessing';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { FlakesTexture, GLTF, RectAreaLightUniformsLib } from 'three-stdlib';

RectAreaLightUniformsLib.init();
THREE.Vector2.prototype.equals = function (v, epsilon = 0.001) {
  return Math.abs(v.x - this.x) < epsilon && Math.abs(v.y - this.y) < epsilon;
};

@Injectable()
export class LerpedPointer extends NgtComponentStore {
  private readonly zone = inject(NgZone);
  private readonly store = inject(NgtStore);

  private readonly previous = new THREE.Vector2();
  readonly pointerRef = new NgtRef<THREE.Vector2>();

  load() {
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.pointerRef.set(this.store.getState((s) => s.pointer).clone());
        return this.store.registerBeforeRender({
          callback: ({ performance, pointer }) => {
            this.previous.copy(this.pointerRef.value);
            this.pointerRef.value.lerp(pointer, 0.1);
            // Regress system when the mouse is moved
            if (!this.previous.equals(this.pointerRef.value)) {
              performance.regress();
            }
          },
        });
      });
    });
  }
}

interface BotGLTF extends GLTF {
  nodes: {
    Alpha_Surface: THREE.Mesh;
    Alpha_Joints: THREE.Mesh;
  };
  materials: {
    Alpha_Body_MAT: THREE.MeshStandardMaterial;
    Alpha_Joints_MAT: THREE.MeshStandardMaterial;
  };
}

@Component({
  selector: 'y-bot',
  standalone: true,
  template: `
    <ng-container *ngIf="bot$ | async as bot">
      <ngt-group (beforeRender)="onBeforeRender($event.object)" [dispose]="null" [position]="position">
        <ngt-mesh castShadow receiveShadow [geometry]="bot.nodes.Alpha_Surface.geometry">
          <ngt-mesh-standard-material
            metalness="0.4"
            roughness="0.2"
            [color]="bot.materials.Alpha_Body_MAT.color"
            [normalMap]="texture"
            [normalScale]="normalScale"
          >
            <ngt-vector2 [attach]="['normalMap', 'repeat']" [vector2]="[35, 35]"></ngt-vector2>
          </ngt-mesh-standard-material>
        </ngt-mesh>
        <ngt-mesh castShadow [geometry]="bot.nodes.Alpha_Joints.geometry">
          <ngt-mesh-standard-material
            metalness="1"
            roughness="0.1"
            [color]="bot.materials.Alpha_Joints_MAT.color"
          ></ngt-mesh-standard-material>
        </ngt-mesh>
      </ngt-group>
    </ng-container>
  `,
  imports: [NgIf, AsyncPipe, NgtGroup, NgtMesh, NgtMeshStandardMaterial, NgtVector2Attribute, NgtGroup],
})
export class YBot {
  @Input() position?: NgtVector3;

  private readonly lerpedPointer = inject(LerpedPointer);

  readonly normalScale = new THREE.Vector2(0.15, 0.15);

  readonly texture = new THREE.CanvasTexture(
    new FlakesTexture() as any,
    THREE.UVMapping,
    THREE.RepeatWrapping,
    THREE.RepeatWrapping
  );

  readonly bot$ = inject(NgtGLTFLoader).load('assets/untitled-draco2.glb') as Observable<BotGLTF>;

  onBeforeRender(group: THREE.Group) {
    group.rotation.x = (this.lerpedPointer.pointerRef.value.y * Math.PI) / 200;
    group.rotation.y = (this.lerpedPointer.pointerRef.value.x * Math.PI) / 10;
  }
}

@Component({
  selector: 'lights',
  standalone: true,
  template: `
    <ngt-directional-light intensity="1" [position]="[2, 2, 0]" color="red"></ngt-directional-light>
    <ngt-spot-light intensity="2" [position]="[-5, 10, 2]" angle="0.2" penumbra="1" castShadow>
      <ngt-vector2 [attach]="['shadow', 'mapSize']" [vector2]="[2048, 2048]"></ngt-vector2>
    </ngt-spot-light>
    <ngt-group (beforeRender)="onBeforeRender($event.object)">
      <ngt-rect-area-light
        intensity="2"
        [position]="[4.5, 0, -3]"
        width="40"
        height="4"
        (update)="onUpdate($event)"
      ></ngt-rect-area-light>
      <ngt-rect-area-light
        intensity="2"
        [position]="[-10, 2, -10]"
        width="40"
        height="4"
        (update)="onUpdate($event)"
      ></ngt-rect-area-light>
    </ngt-group>
  `,
  imports: [NgtDirectionalLight, NgtSpotLight, NgtVector2Attribute, NgtGroup, NgtRectAreaLight],
})
export class Lights {
  private readonly lerpedPointer = inject(LerpedPointer);

  onUpdate($event: THREE.RectAreaLight) {
    $event.lookAt(0, 0, 0);
  }

  onBeforeRender(group: THREE.Group) {
    group.rotation.x = (this.lerpedPointer.pointerRef.value.x * Math.PI) / 2;
    group.rotation.y = Math.PI * 0.25 - (this.lerpedPointer.pointerRef.value.y * Math.PI) / 2;
  }
}

@Component({
  selector: 'effects',
  standalone: true,
  template: `
    <ngt-effect-composer multisampling="8">
      <ngt-ssao-effect
        [ref]="ssaoRef"
        intensity="20"
        radius="0.1"
        luminanceInfluence="0"
        bias="0.035"
      ></ngt-ssao-effect>
      <ngt-bloom-effect mipmapBlur luminanceThreshold="0.8" intensity="5"></ngt-bloom-effect>
    </ngt-effect-composer>
  `,
  imports: [NgtEffectComposer, NgtSSAOEffect, NgtBloomEffect],
})
export class Effects extends NgtComponentStore implements OnInit {
  private readonly zone = inject(NgZone);
  private readonly store = inject(NgtStore);

  readonly ssaoRef = new NgtRef() as any;

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() =>
        this.store.registerBeforeRender({
          callback: ({ performance }) => {
            if (this.ssaoRef.value) {
              this.ssaoRef.value.blendMode.blendFunction =
                performance.current < 1 ? BlendFunction.SKIP : BlendFunction.MULTIPLY;
            }
          },
        })
      );
    });
  }
}

@Component({
  selector: 'scene',
  standalone: true,
  template: `
    <lights></lights>

    <y-bot [position]="[0, -1.3, 0]"></y-bot>
    <ngt-soba-text text="hello" [position]="[0, 0, -0.2]" fontSize="0.6" color="white" letterSpacing="0">
      <ngt-value [attach]="['material', 'fog']" [value]="false"></ngt-value>
    </ngt-soba-text>

    <ngt-mesh [scale]="4" [position]="[0, 1, -0.2]">
      <ngt-plane-geometry></ngt-plane-geometry>
      <ngt-mesh-standard-material
        color="lightblue"
        toneMapped="false"
        fog="false"
        envMapIntensity="0"
      ></ngt-mesh-standard-material>
    </ngt-mesh>

    <ngt-soba-adaptive-dpr pixelated></ngt-soba-adaptive-dpr>
    <effects></effects>
  `,
  providers: [LerpedPointer],
  imports: [
    Lights,
    YBot,
    NgtSobaText,
    NgtValueAttribute,
    NgtPlaneGeometry,
    NgtMeshStandardMaterial,
    NgtSobaAdaptiveDpr,
    Effects,
    NgtMesh,
  ],
})
class Scene {
  constructor(lerpedPointer: LerpedPointer) {
    lerpedPointer.load();
  }
}

@Component({
  selector: 'sandbox-movement-regression',
  standalone: true,
  template: `
    <ngt-canvas
      shadows
      initialLog
      [dpr]="[1, 2]"
      [gl]="{ antialias: false }"
      [camera]="{ position: [0, 0, 0.8], fov: 75, near: 0.5, far: 1 }"
      [performance]="{ min: 0.1 }"
    >
      <ngt-color attach="background" color="lightblue"></ngt-color>
      <ngt-fog attach="fog" [fog]="['#000', 0.8, 1]"></ngt-fog>

      <scene></scene>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
  `,
  imports: [NgtCanvas, NgtColorAttribute, NgtFogAttribute, Scene, NgtStats],
})
export default class SandboxMovementRegression {}
