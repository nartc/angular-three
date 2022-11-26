import { NgtRef } from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/objects';
import { Directive, inject, Input, TemplateRef } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ng-template[sobaCameraContent]',
    standalone: true,
})
export class SobaCameraContent {
    readonly templateRef = inject(TemplateRef);

    @Input() sobaCameraContent: boolean | '' = '';

    static ngTemplateContextGuard(
        dir: SobaCameraContent,
        ctx: unknown
    ): ctx is { $implicit: NgtRef<THREE.WebGLRenderTarget>; group?: NgtGroup } {
        return true;
    }
}
