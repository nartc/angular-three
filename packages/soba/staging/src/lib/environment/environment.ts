import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  TemplateRef,
} from '@angular/core';
import { NgtsEnvironmentCube } from './environment-cube';
import { NgtsEnvironmentGround } from './environment-ground';
import { NgtsEnvironmentInputs } from './environment-inputs';
import { NgtsEnvironmentMap } from './environment-map';
import { NgtsEnvironmentPortal } from './environment-portal';

@Directive({ selector: 'ng-template[ngtsEnvironmentContent]', standalone: true })
export class NgtsEnvironmentContent {}

@Component({
  selector: 'ngts-environment',
  standalone: true,
  template: `
    <ngts-environment-ground
      *ngIf="get('ground'); else noGround"
      [ground]="get('ground')"
      [map]="get('map')"
      [scene]="get('scene')"
      [blur]="get('blur')"
      [background]="get('background')"
      [preset]="get('preset')"
      [frames]="get('frames')"
      [far]="get('far')"
      [near]="get('near')"
      [resolution]="get('resolution')"
      [files]="get('files')"
      [path]="get('path')"
      [extensions]="get('extensions')"
    />
    <ng-template #noGround>
      <ngts-environment-map
        *ngIf="get('map'); else noMap"
        [map]="get('map')"
        [scene]="get('scene')"
        [blur]="get('blur')"
        [background]="get('background')"
      />
      <ng-template #noMap>
        <ngts-environment-portal
          *ngIf="content; else noPortal"
          [frames]="get('frames')"
          [far]="get('far')"
          [near]="get('near')"
          [resolution]="get('resolution')"
          [map]="get('map')"
          [background]="get('background')"
          [blur]="get('blur')"
          [scene]="get('scene')"
          [files]="get('files')"
          [path]="get('path')"
          [preset]="get('preset')"
          [extensions]="get('extensions')"
        />
        <ng-template #noPortal>
          <ngts-environment-cube
            [frames]="get('frames')"
            [far]="get('far')"
            [near]="get('near')"
            [resolution]="get('resolution')"
            [map]="get('map')"
            [background]="get('background')"
            [blur]="get('blur')"
            [scene]="get('scene')"
            [files]="get('files')"
            [path]="get('path')"
            [preset]="get('preset')"
            [extensions]="get('extensions')"
          />
        </ng-template>
      </ng-template>
    </ng-template>
  `,
  imports: [
    NgtsEnvironmentMap,
    NgtsEnvironmentGround,
    NgtsEnvironmentCube,
    NgtsEnvironmentPortal,
    NgIf,
    NgTemplateOutlet,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsEnvironment extends NgtsEnvironmentInputs {
  @ContentChild(NgtsEnvironmentContent, { read: TemplateRef }) content?: TemplateRef<unknown>;
}
