import { startWithUndefined } from '@angular-three/core';
import { Directive, OnInit } from '@angular/core';
import { combineLatest, startWith } from 'rxjs';
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
                this.select('map'),
                this.select('scene').pipe(startWithUndefined()),
                this.select('background').pipe(startWith(false)),
                this.select('blur').pipe(startWithUndefined()),
            ]),
            ([defaultScene, map, scene, background, blur]) => {
                if (map) {
                    return setEnvProps(background, scene, defaultScene, map, blur);
                }
            }
        );
    }
}
