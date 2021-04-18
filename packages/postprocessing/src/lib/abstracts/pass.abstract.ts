import { applyProps, CanvasStore } from '@angular-three/core';
import type { ThreeInstance, UnknownRecord } from '@angular-three/core/typings';
import {
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  SkipSelf,
} from '@angular/core';
import { Pass } from 'three/examples/jsm/postprocessing/Pass';
import { EffectComposerDirective } from '../effect-composer.directive';

@Directive()
export abstract class ThreePass<TPass extends Pass = Pass>
  implements OnInit, OnDestroy, OnChanges {
  @Input() enabled?: boolean;
  @Input() needsSwap?: boolean;
  @Input() clear?: boolean;
  @Input() renderToScreen?: boolean;

  @Input() set assignTo(values: [string, unknown][]) {
    if (values.length) {
      this._assignTo = values;
      if (this.pass) {
        this.assignToPass(values);
      } else {
        setTimeout(() => {
          this.assignToPass(this._assignTo);
        });
      }
    }
  }

  @Output() ready = new EventEmitter<TPass>();

  constructor(
    protected readonly ngZone: NgZone,
    @SkipSelf() protected readonly canvasStore: CanvasStore,
    @Optional() protected readonly composer?: EffectComposerDirective
  ) {}

  protected abstract passType: new (...args: any[]) => TPass;

  protected extraInputs: string[] = [];
  private _assignTo: [string, unknown][] = [];
  private _extraArgs: unknown[] = [];

  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  private _pass!: TPass;

  ngOnChanges(changes: SimpleChanges) {
    this.ngZone.runOutsideAngular(() => {
      if (this.pass) {
        this.applyExtraInputs(changes);
      }
    });
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.useSceneAndCamera) {
        const { scene, camera } = this.canvasStore.getImperativeState();
        this._extraArgs = [scene, camera, ...this._extraArgs];
      }
      this._pass = new this.passType(...this._extraArgs);
      this.applyExtraInputs();
      if (this.composer) {
        this.composer.composer.addPass(this.pass);
      }
      this.ngZone.run(() => {
        this.ready.emit(this.pass);
      });
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

  private applyExtraInputs(inputChanges?: SimpleChanges): void {
    this.ngZone.runOutsideAngular(() => {
      const extraProps = [
        'enabled',
        'needsSwap',
        'clear',
        'renderToScreen',
        ...this.extraInputs,
      ].reduce((extraProps, extraInput) => {
        let inputProp = ((this as unknown) as UnknownRecord)[extraInput];
        if (inputChanges) {
          if (inputChanges[extraInput]) {
            inputProp = inputChanges[extraInput].currentValue;
            extraProps[extraInput] = inputProp;
          }
        } else {
          if (inputProp) {
            extraProps[extraInput] = inputProp;
          }
        }

        return extraProps;
      }, {} as UnknownRecord);
      applyProps((this.pass as unknown) as ThreeInstance, extraProps);
    });
  }

  private assignToPass(values: [string, unknown][]) {
    this.ngZone.runOutsideAngular(() => {
      const propsToAssign = values.reduce((props, [key, value]) => {
        props[key] = value;
        return props;
      }, {} as UnknownRecord);

      applyProps((this.pass as unknown) as ThreeInstance, propsToAssign);
    });
  }
}
