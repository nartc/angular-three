import { AnimationStore, CanvasStore } from '@angular-three/core';
import { EffectComposerDirective } from '@angular-three/postprocessing';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { distinctUntilKeyChanged, map } from 'rxjs/operators';
import { Vector2 } from 'three';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

@Component({
  selector: 'demo-boxes-effects',
  template: `
    <ngt-effectComposer *ngIf="aspect$ | async as aspect">
      <ngt-renderPass></ngt-renderPass>
      <ngt-sSAOPass [kernelRadius]="0.6" [maxDistance]="0.03"></ngt-sSAOPass>
      <ngt-unrealBloomPass [args]="[aspect, 2, 1, 0.991]"></ngt-unrealBloomPass>
      <ngt-shaderPass
        [args]="[FXAAShader]"
        [renderToScreen]="true"
      ></ngt-shaderPass>
    </ngt-effectComposer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxesEffectsComponent implements AfterViewInit {
  aspect$ = this.canvasStore.canvasInternal$.pipe(
    distinctUntilKeyChanged('size'),
    map(({ size }) => {
      if (this.effectComposer) {
        this.effectComposer.composer.setSize(size.width, size.height);
      }
      return new Vector2(size.width, size.height);
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
    });
  }
}
