import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Directive, inject, TemplateRef } from '@angular/core';
import { SobaEnvironmentCube } from './environment-cube';
import { SobaEnvironmentGround } from './environment-ground';
import { SobaEnvironmentInputs } from './environment-inputs';
import { SobaEnvironmentMap } from './environment-map';
import { SobaEnvironmentPortal } from './environment-portal';

@Directive({
    selector: 'ng-template[ngt-soba-environment-content]',
    standalone: true,
})
export class SobaEnvironmentContent {
    readonly templateRef = inject(TemplateRef);
}

@Component({
    selector: 'ngt-soba-environment',
    standalone: true,
    template: `
        <ngt-soba-environment-ground
            *ngIf="readKey('ground'); else notGround"
            [frames]="readKey('frames')"
            [near]="readKey('near')"
            [far]="readKey('far')"
            [resolution]="readKey('resolution')"
            [background]="readKey('background')"
            [map]="readKey('map')"
            [files]="readKey('files')"
            [path]="readKey('path')"
            [preset]="readKey('preset')"
            [scene]="readKey('scene')"
            [extensions]="readKey('extensions')"
            [ground]="readKey('ground')"
            [blur]="readKey('blur')"
            [encoding]="readKey('encoding')"
        ></ngt-soba-environment-ground>
        <ng-template #notGround>
            <ngt-soba-environment-map
                *ngIf="readKey('map'); else notMap"
                [frames]="readKey('frames')"
                [near]="readKey('near')"
                [far]="readKey('far')"
                [resolution]="readKey('resolution')"
                [background]="readKey('background')"
                [map]="readKey('map')"
                [files]="readKey('files')"
                [path]="readKey('path')"
                [preset]="readKey('preset')"
                [scene]="readKey('scene')"
                [extensions]="readKey('extensions')"
                [ground]="readKey('ground')"
                [blur]="readKey('blur')"
                [encoding]="readKey('encoding')"
            ></ngt-soba-environment-map>

            <ng-template #notMap>
                <ngt-soba-environment-portal
                    *ngIf="content; else notPortal"
                    [frames]="readKey('frames')"
                    [near]="readKey('near')"
                    [far]="readKey('far')"
                    [resolution]="readKey('resolution')"
                    [background]="readKey('background')"
                    [map]="readKey('map')"
                    [files]="readKey('files')"
                    [path]="readKey('path')"
                    [preset]="readKey('preset')"
                    [scene]="readKey('scene')"
                    [extensions]="readKey('extensions')"
                    [ground]="readKey('ground')"
                    [blur]="readKey('blur')"
                    [encoding]="readKey('encoding')"
                >
                    <ng-container *ngIf="content" [ngTemplateOutlet]="content.templateRef"></ng-container>
                </ngt-soba-environment-portal>

                <ng-template #notPortal>
                    <ngt-soba-environment-cube
                        [frames]="readKey('frames')"
                        [near]="readKey('near')"
                        [far]="readKey('far')"
                        [resolution]="readKey('resolution')"
                        [background]="readKey('background')"
                        [map]="readKey('map')"
                        [files]="readKey('files')"
                        [path]="readKey('path')"
                        [preset]="readKey('preset')"
                        [scene]="readKey('scene')"
                        [extensions]="readKey('extensions')"
                        [ground]="readKey('ground')"
                        [blur]="readKey('blur')"
                        [encoding]="readKey('encoding')"
                    ></ngt-soba-environment-cube>
                </ng-template>
            </ng-template>
        </ng-template>
    `,
    imports: [
        SobaEnvironmentGround,
        SobaEnvironmentPortal,
        NgTemplateOutlet,
        SobaEnvironmentCube,
        SobaEnvironmentMap,
        NgIf,
    ],
})
export class SobaEnvironment extends SobaEnvironmentInputs {
    @ContentChild(SobaEnvironmentContent)
    content?: SobaEnvironmentContent;
}
