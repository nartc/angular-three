import { NgtObjectCompound, provideInstanceRef } from '@angular-three/core';
import { NgtPerspectiveCamera } from '@angular-three/core/cameras';
import { NgtGroup } from '@angular-three/core/objects';
import { SobaCameraContent } from '@angular-three/soba/cameras';
import { SobaFBO } from '@angular-three/soba/misc';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild } from '@angular/core';
import { SobaCamera } from '../camera/camera';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';

@Component({
    selector: 'ngt-soba-perspective-camera',
    standalone: true,
    template: `
        <ngt-perspective-camera
            [objectCompound]="this"
            [aspect]="aspect$"
            [fov]="selectKey('fov')"
            [near]="selectKey('near')"
            [far]="selectKey('far')"
        >
            <ng-container
                *ngIf="cameraContent && !cameraContent.sobaCameraContent"
                [ngTemplateOutlet]="cameraContent.templateRef"
            ></ng-container>
        </ngt-perspective-camera>
        <ngt-group [ref]="readKey('groupRef')" #group>
            <ng-container
                *ngIf="cameraContent && cameraContent.sobaCameraContent"
                [ngTemplateOutlet]="cameraContent.templateRef"
                [ngTemplateOutletContext]="{ $implicit: readKey('fboRef'), group }"
            ></ng-container>
        </ngt-group>
    `,
    providers: [provideInstanceRef(SobaPerspectiveCamera, { compound: true }), SobaFBO],
    inputs: [...NGT_INSTANCE_INPUTS, ...NGT_OBJECT3D_INPUTS, ...getInputs()],
    outputs: NGT_INSTANCE_OUTPUTS,
    imports: [NgtGroup, NgIf, NgTemplateOutlet, NgtPerspectiveCamera, NgtObjectCompound],
})
export class SobaPerspectiveCamera extends SobaCamera<NgtPerspectiveCamera> {
    @ContentChild(SobaCameraContent) cameraContent?: SobaCameraContent;

    readonly aspect$ = this.select(
        this.store.select((s) => s.size),
        this.select((s) => s['aspect']),
        (size, aspect) => aspect ?? size.width / size.height,
        { debounce: true }
    );

    override get useOnHost(): (keyof NgtPerspectiveCamera | string)[] {
        return [...super.useOnHost, 'fov', 'aspect', 'near', 'far'];
    }
}

function getInputs() {
    return [
        'zoom',
        'fov',
        'aspect',
        'near',
        'far',
        'focus',
        'view',
        'filmGauge',
        'filmOffset',
        'matrixWorldInverse',
        'projectionMatrix',
        'projectionMatrixInverse',
    ];
}
