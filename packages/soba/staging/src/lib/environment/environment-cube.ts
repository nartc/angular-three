import { Directive, OnInit } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, startWith } from 'rxjs';
import { NgtsEnvironmentInputs } from './environment-inputs';
import { injectNgtsEnvironment, setEnvProps } from './utils';

@Directive({
  selector: 'ngts-environment-cube',
  standalone: true,
})
export class NgtsEnvironmentCube extends NgtsEnvironmentInputs implements OnInit {
  readonly textureRef = injectNgtsEnvironment((params) => this.select().pipe(startWith(params)));

  override initialize(): void {
    super.initialize();
    this.set({ background: false });
  }

  ngOnInit() {
    this.#setEnvProps();
  }

  #setEnvProps() {
    this.effect(
      combineLatest([
        this.store.select('scene'),
        this.select(selectSlice(['scene', 'background', 'blur'])),
        this.textureRef.$,
      ]),
      ([defaultScene, { scene, background, blur }, texture]) => {
        return setEnvProps(background, scene, defaultScene, texture, blur);
      }
    );
  }
}
