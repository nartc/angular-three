import {
  extend,
  injectNgtDestroy,
  injectNgtRef,
  injectNgtStore,
  NgtArgs,
  NgtPush,
} from '@angular-three/core';
import { NgtpEffectComposer } from '@angular-three/postprocessing';
import { NgtpBloom, NgtpSSAO } from '@angular-three/postprocessing/effects';
import { NgtsText } from '@angular-three/soba/abstractions';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import { NgtsAdaptiveDpr } from '@angular-three/soba/performance';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { BlendFunction, SSAOEffect } from 'postprocessing';
import { Observable } from 'rxjs';
import {
  CanvasTexture,
  Color,
  DirectionalLight,
  Fog,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RectAreaLight,
  RepeatWrapping,
  SpotLight,
  UVMapping,
  Vector2,
} from 'three';
import { GLTF, RectAreaLightUniformsLib } from 'three-stdlib';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';

RectAreaLightUniformsLib.init();
Vector2.prototype.equals = function (v, epsilon = 0.001) {
  return Math.abs(v.x - this.x) < epsilon && Math.abs(v.y - this.y) < epsilon;
};

extend({
  Color,
  Fog,
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
  DirectionalLight,
  SpotLight,
  Vector2,
  Group,
  RectAreaLight,
});

export function injectLerpedPointer() {
  const store = injectNgtStore();
  const pointer = store.get('pointer');
  const pointerRef = injectNgtRef(pointer.clone());
  const previous = new Vector2();

  const sub = store.get('internal').subscribe((state) => {
    previous.copy(pointerRef.nativeElement);
    pointerRef.nativeElement.lerp(state.pointer, 0.1);
    // Regress system when the mouse is moved
    if (!previous.equals(pointerRef.nativeElement)) state.performance.regress();
  });

  injectNgtDestroy(() => {
    sub();
  });

  return pointerRef;
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
  selector: 'sandbox-y-bot',
  standalone: true,
  template: `
    <ngt-group
      *ngIf="bot$ | ngtPush : null as bot"
      ngtCompound
      (beforeRender)="onBeforeRender($any($event).object)"
    >
      <ngt-mesh castShadow receiveShadow [geometry]="bot.nodes.Alpha_Surface.geometry">
        <ngt-mesh-standard-material
          metalness="0.4"
          roughness="0.2"
          [color]="bot.materials.Alpha_Body_MAT.color"
          [normalMap]="texture"
          [normalScale]="[0.15, 0.15]"
        >
          <ngt-value *args="[35, 35]" attach="normalMap.repeat"></ngt-value>
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
  `,
  imports: [NgtArgs, NgIf, NgtPush, NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class YBot {
  readonly #pointer = injectLerpedPointer();
  readonly bot$ = injectNgtsGLTFLoader('assets/untitled-draco2.glb') as Observable<BotGLTF>;
  readonly texture = new CanvasTexture(
    new FlakesTexture(),
    UVMapping,
    RepeatWrapping,
    RepeatWrapping
  );

  onBeforeRender(group: Group) {
    group.rotation.y = (this.#pointer.nativeElement.x * Math.PI) / 10;
    group.rotation.x = (this.#pointer.nativeElement.y * Math.PI) / 200;
  }
}

@Component({
  selector: 'sandbox-lights',
  standalone: true,
  template: `
    <ngt-directional-light
      intensity="1"
      [position]="[2, 2, 0]"
      color="red"
      distance="5"
    ></ngt-directional-light>
    <ngt-spot-light intensity="2" [position]="[-5, 10, 2]" angle="0.2" penumbra="1" castShadow>
      <ngt-vector2 *args="[2048, 2048]" attach="shadow.mapSize"></ngt-vector2>
    </ngt-spot-light>
    <ngt-group (beforeRender)="onBeforeRender($any($event).object)">
      <ngt-rect-area-light
        intensity="2"
        width="40"
        height="4"
        [position]="[4.5, 0, -3]"
        (afterUpdate)="onAfterUpdate($any($event))"
      ></ngt-rect-area-light>
      <ngt-rect-area-light
        intensity="2"
        width="40"
        height="4"
        [position]="[-10, 2, -10]"
        (afterUpdate)="onAfterUpdate($any($event))"
      ></ngt-rect-area-light>
    </ngt-group>
  `,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Lights {
  readonly onRectLightUpdate = (light: RectAreaLight) => light.lookAt(0, 0, 0);
  readonly #pointer = injectLerpedPointer();

  onBeforeRender(group: Group) {
    group.rotation.x = (this.#pointer.nativeElement.x * Math.PI) / 2;
    group.rotation.y = Math.PI * 0.25 - (this.#pointer.nativeElement.y * Math.PI) / 2;
  }

  onAfterUpdate(light: RectAreaLight) {
    light.lookAt(0, 0, 0);
  }
}

@Component({
  selector: 'sandbox-effects',
  standalone: true,
  template: `
    <ngtp-effect-composer [multisampling]="8">
      <ngtp-ssao
        [ssaoRef]="ssaoRef"
        [intensity]="20"
        [radius]="0.1"
        [luminanceInfluence]="0"
        [bias]="0.035"
      ></ngtp-ssao>
      <ngtp-bloom [mipmapBlur]="true" [luminanceThreshold]="0.8" [intensity]="5"></ngtp-bloom>
    </ngtp-effect-composer>
  `,
  imports: [NgtpEffectComposer, NgtpSSAO, NgtpBloom],
})
export class Effects implements OnInit, OnDestroy {
  readonly ssaoRef = injectNgtRef<SSAOEffect>();
  readonly #store = injectNgtStore();

  #sub?: () => void;

  ngOnInit() {
    this.#sub = this.#store.get('internal').subscribe((state) => {
      if (this.ssaoRef.nativeElement) {
        // Disable SSAO on regress
        this.ssaoRef.nativeElement.blendMode.blendFunction =
          state.performance.current < 1 ? BlendFunction.SKIP : BlendFunction.MULTIPLY;
      }
    });
  }

  ngOnDestroy() {
    this.#sub?.();
  }
}

@Component({
  selector: 'sandbox-movement-regression-scene',
  standalone: true,
  template: `
    <ngt-color *args="['lightblue']" attach="background"></ngt-color>
    <ngt-fog *args="['#000', 0.8, 1]" attach="fog"></ngt-fog>

    <sandbox-lights></sandbox-lights>
    <sandbox-y-bot [position]="[0, -1.3, 0]"></sandbox-y-bot>
    <ngts-text
      text="hello"
      [color]="'white'"
      [position]="[0, 0, -0.2]"
      [fontSize]="0.6"
      [letterSpacing]="0"
    >
      <ngt-value *args="[false]" attach="material.fog"></ngt-value>
    </ngts-text>
    <ngt-mesh scale="4" [position]="[0, 1, -0.2]">
      <ngt-plane-geometry></ngt-plane-geometry>
      <ngt-mesh-standard-material
        color="lightblue"
        [toneMapped]="false"
        [fog]="false"
        envMapIntensity="0"
      ></ngt-mesh-standard-material>
    </ngt-mesh>

    <ngts-adaptive-dpr [pixelated]="true"></ngts-adaptive-dpr>
    <sandbox-effects></sandbox-effects>
  `,
  imports: [Lights, YBot, NgtsText, NgtsAdaptiveDpr, NgtArgs, Effects],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {}
