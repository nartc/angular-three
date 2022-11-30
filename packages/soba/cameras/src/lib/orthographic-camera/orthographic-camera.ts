import { NgtObjectCompound, provideInstanceRef } from '@angular-three/core';
import { NgtOrthographicCamera } from '@angular-three/core/cameras';
import { NgtGroup } from '@angular-three/core/objects';
import { SobaFBO } from '@angular-three/soba/misc';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, OnInit } from '@angular/core';
import { SobaCamera } from '../camera/camera';
import { SobaCameraContent } from '../camera/camera-content';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';

@Component({
    selector: 'ngt-soba-orthographic-camera',
    standalone: true,
    template: `
        <ngt-orthographic-camera
            [objectCompound]="this"
            [left]="left$"
            [right]="right$"
            [top]="top$"
            [bottom]="bottom$"
        >
            <ng-container
                *ngIf="cameraContent && !cameraContent.sobaCameraContent"
                [ngTemplateOutlet]="cameraContent.templateRef"
            ></ng-container>
        </ngt-orthographic-camera>
        <ngt-group [ref]="readKey('groupRef')" #group>
            <ng-container
                *ngIf="cameraContent && cameraContent.sobaCameraContent"
                [ngTemplateOutlet]="cameraContent.templateRef"
                [ngTemplateOutletContext]="{ $implicit: readKey('fboRef'), group }"
            ></ng-container>
        </ngt-group>
    `,
    imports: [NgtOrthographicCamera, NgtGroup, NgIf, NgTemplateOutlet, NgtObjectCompound],
    providers: [provideInstanceRef(SobaOrthographicCamera, { compound: true }), SobaFBO],
    inputs: [...NGT_INSTANCE_INPUTS, ...NGT_OBJECT3D_INPUTS, ...getInputs()],
    outputs: NGT_INSTANCE_OUTPUTS,
})
export class SobaOrthographicCamera extends SobaCamera<NgtOrthographicCamera> implements OnInit {
    @ContentChild(SobaCameraContent) cameraContent?: SobaCameraContent;

    readonly left$ = this.select(
        this.store.select((s) => s.size),
        this.select((s) => s['left']),
        (size, left) => left ?? size.width / -2,
        { debounce: true }
    );

    readonly right$ = this.select(
        this.store.select((s) => s.size),
        this.select((s) => s['right']),
        (size, right) => right ?? size.width / 2,
        { debounce: true }
    );

    readonly top$ = this.select(
        this.store.select((s) => s.size),
        this.select((s) => s['top']),
        (size, top) => top ?? size.height / 2,
        { debounce: true }
    );

    readonly bottom$ = this.select(
        this.store.select((s) => s.size),
        this.select((s) => s['bottom']),
        (size, bottom) => bottom ?? size.height / -2,
        { debounce: true }
    );

    override get useOnHost(): (keyof NgtOrthographicCamera | string)[] {
        return [...super.useOnHost, 'left', 'right', 'top', 'bottom'];
    }
}

function getInputs() {
    return [
        'zoom',
        'view',
        'left',
        'right',
        'top',
        'bottom',
        'near',
        'far',
        'matrixWorldInverse',
        'projectionMatrix',
        'projectionMatrixInverse',
    ];
}
