import {
  AnimationStore,
  CanvasStore,
  DestroyedService,
} from '@angular-three/core';
import { EffectComposerDirective } from '@angular-three/postprocessing';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { distinctUntilKeyChanged, map, pluck, takeUntil } from 'rxjs/operators';
import { Uniform, Vector2 } from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
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
        (ready)="onShaderPassReady($event)"
      ></ngt-shaderPass>
    </ngt-effectComposer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyedService],
})
export class BoxesEffectsComponent implements AfterViewInit {
  readonly size$ = this.canvasStore.canvasInternal$.pipe(
    distinctUntilKeyChanged('size'),
    pluck('size')
  );

  aspect$ = this.size$.pipe(
    map((size) => {
      if (this.effectComposer) {
        this.effectComposer.composer.setSize(size.width, size.height);
      }
      return new Vector2(size.width, size.height);
    })
  );

  readonly FXAAShader = FXAAShader;

  @ViewChild(EffectComposerDirective) effectComposer?: EffectComposerDirective;

  shaderPass?: ShaderPass;

  constructor(
    private readonly animationStore: AnimationStore,
    private readonly canvasStore: CanvasStore,
    private readonly destroyed: DestroyedService
  ) {}

  ngAfterViewInit() {
    this.size$.pipe(takeUntil(this.destroyed)).subscribe((size) => {
      this.effectComposer?.composer.setSize(size.width, size.height);
      if (this.shaderPass) {
        this.shaderPass.material.uniforms.resolution = new Uniform(
          new Vector2(1 / size.width, 1 / size.height)
        );
        this.shaderPass.material.needsUpdate = true;
      }
    });

    this.animationStore.registerAnimation(() => {
      this.effectComposer?.composer.render();
    }, 2);
  }

  onShaderPassReady(pass: ShaderPass) {
    this.shaderPass = pass;
  }
}
