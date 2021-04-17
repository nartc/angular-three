import { applyProps, CanvasStore } from '@angular-three/core';
import type { ThreeInstance } from '@angular-three/core/typings';
import {
  Directive,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import { Pass } from 'three/examples/jsm/postprocessing/Pass';
import { EffectComposerDirective } from '../effect-composer.directive';

@Directive()
export abstract class ThreePass<TPass extends Pass = Pass>
  implements OnInit, OnDestroy {
  @Input() enabled?: boolean;
  @Input() needsSwap?: boolean;
  @Input() clear?: boolean;
  @Input() renderToScreen?: boolean;

  constructor(
    protected readonly ngZone: NgZone,
    @SkipSelf() protected readonly canvasStore: CanvasStore,
    @Optional() protected readonly composer?: EffectComposerDirective
  ) {}

  protected abstract passType: new (...args: any[]) => TPass;
  protected extraInputs: string[] = [];

  private _extraArgs: unknown[] = [];

  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  private _pass!: TPass;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.useSceneAndCamera) {
        const { scene, camera } = this.canvasStore.getImperativeState();
        this._extraArgs[0] = scene;
        this._extraArgs[1] = camera;
      }
      this._pass = new this.passType(...this._extraArgs);
      this.applyExtraInputs();
      if (this.composer) {
        this.composer.composer.addPass(this.pass);
      }
    });
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.composer) {
        this.composer.composer.removePass(this.pass);
      }
    });
  }

  get pass(): TPass {
    return this._pass;
  }

  protected get useSceneAndCamera() {
    return false;
  }

  private applyExtraInputs(): void {
    this.ngZone.runOutsideAngular(() => {
      const extraProps = [
        'enabled',
        'needsSwap',
        'clear',
        'renderToScreen',
        ...this.extraInputs,
      ].reduce((extraProps, extraInput) => {
        const inputProp = ((this as unknown) as Record<string, unknown>)[
          extraInput
        ];
        if (inputProp) {
          extraProps[extraInput] = inputProp;
        }
        return extraProps;
      }, {} as Record<string, unknown>);
      applyProps((this.pass as unknown) as ThreeInstance, extraProps);
    });
  }
}
