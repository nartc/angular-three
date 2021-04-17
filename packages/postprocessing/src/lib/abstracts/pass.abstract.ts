import { Directive, OnDestroy, OnInit, Optional } from '@angular/core';
import { Pass } from 'three/examples/jsm/postprocessing/Pass';
import { EffectComposerDirective } from '../effect-composer.directive';

@Directive()
export abstract class ThreePass<TPass extends Pass = Pass>
  implements OnInit, OnDestroy {
  constructor(
    @Optional() protected readonly composer?: EffectComposerDirective
  ) {}

  abstract passType: new (...args: any[]) => TPass;

  private _extraArgs: unknown[] = [];

  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  private _pass!: TPass;

  ngOnInit() {
    this._pass = new this.passType(...this._extraArgs);
    if (this.customize) {
      this.customize();
    }
    if (this.composer) {
      this.composer.composer.addPass(this.pass);
    }
  }

  ngOnDestroy() {
    if (this.composer) {
      this.composer.composer.removePass(this.pass);
    }
  }

  get pass(): TPass {
    return this._pass;
  }

  customize?: () => void;
}
