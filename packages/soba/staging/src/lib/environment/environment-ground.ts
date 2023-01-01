import { extend, NgtArgs, startWithUndefined } from '@angular-three/core';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { combineLatest, map, startWith } from 'rxjs';
import { GroundProjectedEnv } from 'three-stdlib';
import { NgtsEnvironmentInputs } from './environment-inputs';
import { NgtsEnvironmentMap } from './environment-map';
import { injectNgtsEnvironment } from './utils';

extend({ GroundProjectedEnv });

@Component({
  selector: 'ngts-environment-ground',
  standalone: true,
  template: `
    <ng-container *ngIf="get('texture') as texture">
      <ngts-environment-map
        [background]="get('background')"
        [blur]="get('blur')"
        [scene]="get('scene')"
        [map]="texture"
      ></ngts-environment-map>
    </ng-container>
    <ng-container *ngIf="get('groundArgs') as groundArgs">
      <ngt-ground-projected-env
        *args="groundArgs"
        [scale]="get('groundScale')"
        [height]="get('groundHeight')"
        [radius]="get('groundRadius')"
      ></ngt-ground-projected-env>
    </ng-container>
  `,
  imports: [NgtsEnvironmentMap, NgtArgs, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsEnvironmentGround extends NgtsEnvironmentInputs {
  readonly defaultTexture = injectNgtsEnvironment((params) =>
    this.select().pipe(startWith(params))
  );

  ngOnInit() {
    this.connect(
      'texture',
      combineLatest([this.select('map').pipe(startWithUndefined()), this.defaultTexture.$]).pipe(
        map(([map, texture]) => map || texture)
      )
    );
    this.connect('groundArgs', this.select('texture').pipe(map((texture) => [texture])));
    this.connect(
      'groundHeight',
      this.select(['ground'], ({ ground }) => ground?.height)
    );
    this.connect(
      'groundRadius',
      this.select(['ground'], ({ ground }) => ground?.radius)
    );
    this.connect(
      'groundScale',
      this.select(['ground'], ({ ground }) => ground?.scale ?? 1000)
    );
  }
}
