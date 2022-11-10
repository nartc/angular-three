import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Directive, TemplateRef } from '@angular/core';
import { NgtSobaEnvironmentCube } from './environment-cube';
import { NgtSobaEnvironmentGround } from './environment-ground';
import {
  NgtSobaEnvironmentInputs,
  NgtSobaEnvironmentInputsPassThrough,
  provideNgtSobaEnvironmentInputs,
} from './environment-inputs';
import { NgtSobaEnvironmentMap } from './environment-map';
import { NgtSobaEnvironmentPortal } from './environment-portal';

@Directive({
  selector: 'ng-template[ngt-soba-environment-content]',
  standalone: true,
})
export class NgtSobaEnvironmentContent {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'ngt-soba-environment',
  standalone: true,
  template: `
    <ngt-soba-environment-ground
      *ngIf="ground; else notGround"
      [ngtSobaEnvironmentInputsPassThrough]="this"
    ></ngt-soba-environment-ground>
    <ng-template #notGround>
      <ngt-soba-environment-map
        *ngIf="map; else notMap"
        [ngtSobaEnvironmentInputsPassThrough]="this"
      ></ngt-soba-environment-map>

      <ng-template #notMap>
        <ngt-soba-environment-portal *ngIf="content; else notPortal" [ngtSobaEnvironmentInputsPassThrough]="this">
          <ng-container *ngTemplateOutlet="content.templateRef"></ng-container>
        </ngt-soba-environment-portal>

        <ng-template #notPortal>
          <ngt-soba-environment-cube [ngtSobaEnvironmentInputsPassThrough]="this"></ngt-soba-environment-cube>
        </ng-template>
      </ng-template>
    </ng-template>
  `,
  providers: [provideNgtSobaEnvironmentInputs(NgtSobaEnvironment)],
  imports: [
    NgIf,
    NgtSobaEnvironmentGround,
    NgtSobaEnvironmentInputsPassThrough,
    NgtSobaEnvironmentMap,
    NgtSobaEnvironmentPortal,
    NgTemplateOutlet,
    NgtSobaEnvironmentCube,
  ],
})
export class NgtSobaEnvironment extends NgtSobaEnvironmentInputs {
  @ContentChild(NgtSobaEnvironmentContent)
  content?: NgtSobaEnvironmentContent;
}
