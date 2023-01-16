import { Directive, inject, Input, TemplateRef } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ng-template[ngtsCameraContent]',
    standalone: true,
})
export class NgtsCameraContent {
    readonly template = inject(TemplateRef);
    @Input() ngtsCameraContent: boolean | '' = '';

    static ngTemplateContextGuard(
        dir: NgtsCameraContent,
        ctx: unknown
    ): ctx is { target: THREE.WebGLRenderTarget; group?: THREE.Group } {
        return true;
    }
}
