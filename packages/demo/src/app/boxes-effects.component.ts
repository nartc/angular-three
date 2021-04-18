import { AnimationStore, CanvasStore } from '@angular-three/core';
import { EffectComposerDirective } from '@angular-three/postprocessing';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { distinctUntilKeyChanged, map, pluck } from 'rxjs/operators';
import { Vector2 } from 'three';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

@Component({
  selector: 'demo-boxes-effects',
  template: `
    <ngt-effectComposer *ngIf="vm$ | async as vm">
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
export class BoxesEffectsComponent implements AfterViewInit {
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

  @ViewChild(EffectComposerDirective) effectComposer?: EffectComposerDirective;

  constructor(
    private readonly animationStore: AnimationStore,
    private readonly canvasStore: CanvasStore
  ) {}

  ngAfterViewInit() {
    this.animationStore.registerAnimation(() => {
      this.effectComposer?.composer.render();
    }, 2);
  }
}
