import { Directive, OnInit } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest } from 'rxjs';
import { NgtsEnvironmentInputs } from './environment-inputs';
import { setEnvProps } from './utils';

@Directive({
  selector: 'ngts-environment-map',
  standalone: true,
})
export class NgtsEnvironmentMap extends NgtsEnvironmentInputs implements OnInit {
  override initialize() {
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
        this.select(selectSlice(['scene', 'map', 'background', 'blur'])),
      ]),
      ([defaultScene, { scene, map, background, blur }]) => {
        if (map) {
          return setEnvProps(background, scene, defaultScene, map, blur);
        }
      }
    );
  }
}
