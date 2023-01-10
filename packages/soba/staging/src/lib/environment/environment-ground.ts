import { extend, NgtArgs, startWithUndefined } from '@angular-three/core';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
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
    <ngts-environment-map
      [background]="get('background')"
      [blur]="get('blur')"
      [scene]="get('scene')"
      [map]="get('texture')"
    />
    <ng-container *ngIf="get('groundArgs') as groundArgs">
      <ngt-ground-projected-env
        *args="groundArgs"
        [scale]="get('groundScale')"
        [height]="get('groundHeight')"
        [radius]="get('groundRadius')"
      />
    </ng-container>
  `,
  imports: [NgtsEnvironmentMap, NgtArgs, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsEnvironmentGround extends NgtsEnvironmentInputs implements OnInit {
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
