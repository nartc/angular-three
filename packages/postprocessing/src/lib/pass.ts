import {
  AnyConstructor,
  applyProps,
  CanvasStore,
  NgtInstance,
  UnknownRecord,
} from '@angular-three/core';
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
import { NgtEffectComposer } from './effect-composer.directive';

@Directive()
export abstract class NgtPass<TPass extends Pass = Pass>
  implements OnInit, OnDestroy, OnChanges
{
  @Input() enabled?: boolean;
  @Input() needsSwap?: boolean;
  @Input() clear?: boolean;
  @Input() renderToScreen?: boolean;
  @Input() dispose?: () => void;

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
    protected ngZone: NgZone,
    @SkipSelf() protected canvasStore: CanvasStore,
    @Optional() protected composer?: NgtEffectComposer
  ) {}

  protected abstract passType: AnyConstructor<TPass>;

  protected extraInputs: string[] = [];
  private _assignTo: [string, unknown][] = [];
  private _extraArgs: unknown[] = [];

  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
    this.ngZone.runOutsideAngular(() => {
      this.init();
    });
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
      if (!this.pass) {
        this.init();
      } else {
        this.ready.emit(this.pass);
      }
    });
  }

  private init() {
    const { scene, camera } = this.canvasStore.getImperativeState();
    switch (this.useSceneAndCamera) {
      case 'scene':
        this._extraArgs = [scene, ...this._extraArgs];
        break;
      case 'camera':
        this._extraArgs = [camera, ...this._extraArgs];
        break;
      case 'sceneAndCamera':
        this._extraArgs = [scene, camera, ...this._extraArgs];
        break;
    }

    if (
      this.composer &&
      this.pass &&
      this.composer.composer.passes.some((pass) => pass === this.pass)
    ) {
      this.composer.composer.removePass(this.pass);
    }

    this._pass = new this.passType(...this._extraArgs);
    this.applyExtraInputs();
    if (this.composer) {
      this.composer.composer.addPass(this.pass);
    }
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.composer) {
        this.composer.composer.removePass(this.pass);
      }

      if (this.pass && 'dispose' in this.pass) {
        ((this.pass as UnknownRecord).dispose as () => void)();
      }
    });
  }

  get pass(): TPass {
    return this._pass;
  }

  protected get useSceneAndCamera():
    | 'scene'
    | 'camera'
    | 'sceneAndCamera'
    | null {
    return null;
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
        let inputProp = (this as unknown as UnknownRecord)[extraInput];
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
      applyProps(this.pass as unknown as NgtInstance, extraProps);
    });
  }

  private assignToPass(values: [string, unknown][]) {
    this.ngZone.runOutsideAngular(() => {
      const propsToAssign = values.reduce((props, [key, value]) => {
        props[key] = value;
        return props;
      }, {} as UnknownRecord);

      applyProps(this.pass as unknown as NgtInstance, propsToAssign);
    });
  }
}
