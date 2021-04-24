import { AnimationStore, CanvasStore } from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { distinctUntilKeyChanged, map, pluck } from 'rxjs/operators';
import { Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

@Component({
  selector: 'demo-boxes-effects',
  template: `
    <ngt-effectComposer *ngIf="vm$ | async as vm" (ready)="onReady($event)">
      <ngt-renderPass></ngt-renderPass>
      <ngt-sSAOPass [kernelRadius]="0.6" [maxDistance]="0.03"></ngt-sSAOPass>
      <ngt-unrealBloomPass
        [args]="[vm.aspect, 2, 1, 0.991]"
      ></ngt-unrealBloomPass>
      <ngt-shaderPass
        [args]="[FXAAShader]"
        [renderToScreen]="true"
        [assignTo]="[
          ['material.uniforms.resolution.value', vm.resolutionValue]
        ]"
      ></ngt-shaderPass>
    </ngt-effectComposer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxesEffectsComponent {
  vm$ = this.canvasStore.canvasInternal$.pipe(
    distinctUntilKeyChanged('size'),
    pluck('size'),
    map(({ width, height }) => {
      return {
        aspect: new Vector2(width, height),
        resolutionValue: new Vector2(1 / width, 1 / height),
      };
    })
  );

  readonly FXAAShader = FXAAShader;

  constructor(
    private readonly animationStore: AnimationStore,
    private readonly canvasStore: CanvasStore
  ) {}

  onReady(composer: EffectComposer) {
    this.animationStore.registerAnimation(() => {
      composer.render();
    }, 2);
  }
}
