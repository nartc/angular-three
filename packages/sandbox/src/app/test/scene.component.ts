import { extend, injectNgtRef, injectNgtStore, NgtArgs } from '@angular-three/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    inject,
    Input,
    OnInit,
    TemplateRef,
} from '@angular/core';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, MeshNormalMaterial, PlaneGeometry } from 'three';

// NgtRenderNode

// 1. straight forward. THREE instances
// 2. structural directives.

/**
 * <ngt-mesh *ngIf="true">
 *   <ngt-box-geometry *args="[2, 2, 2]"></ngt-box-geometry>
 *   <ngt-mesh-basic-material *ngIf="true"></ngt-mesh-basic-material>
 * </ngt-mesh>
 */

// 3. Angular Component (w/ and w/o structural directives)
/**
 * selector: 'some-selector',
 * template: `
 *   <ngt-mesh>
 *     <ng-content></ng-content>
 *   </ngt-mesh>
 *   <some-other-component></some-other-component>
 *   <some-other-component *ngIf=""></some-other-component>
 * `
 */

// 4. THREE instances wrapping Component (w/ and w/o structural directives)
/**
 * <ngt-mesh>
 *   <some-component></some-component>
 *  </ngt-mesh>
 */

// 5. Compound Components (w/ and w/o structural directives)
/**
 * <ngt-mesh ngtCompound>
 *     </ngt-mesh>
 *     <ngt-group>
 *     </ngt-group>
 *     <some-component>
 *     <some-compound-component>
 */

/**
 * <some-compound-component [position]="[2, 2, 2]"> --> <ngt-mesh [position]="[2, 2, 2]"
 */

extend({ Mesh, BoxGeometry, PlaneGeometry, MeshBasicMaterial, MeshNormalMaterial, Group });

@Component({
    selector: 'ngts-center',
    standalone: true,
    template: `
        <ngt-group>
            <ngt-group>
                <ngt-group [ref]="ref" ngtCompound>
                    <ng-content />
                </ngt-group>
            </ngt-group>
        </ngt-group>
    `,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Center {
    @Input() ref = injectNgtRef<Group>();
}

@Component({
    selector: 'ngts-box',
    standalone: true,
    template: `
        <ngt-mesh ngtCompound [ref]="ref">
            <ngt-box-geometry *args="args" />
            <ng-content />
        </ngt-mesh>
    `,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Box {
    @Input() ref = injectNgtRef<Mesh>();
    @Input() args: ConstructorParameters<typeof BoxGeometry> = [];
}

@Component({
    selector: 'sandbox-cube',
    standalone: true,
    template: `
        <ngts-box>
            <ng-content />
        </ngts-box>
    `,
    imports: [Box],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Cube {}

@Component({
    selector: 'sandbox-cube-with-template',
    standalone: true,
    template: `
        <ngts-box [name]="name">
            <ng-container *ngIf="template" [ngTemplateOutlet]="template" />
        </ngts-box>
        <ng-content />
    `,
    imports: [Box, NgIf, NgTemplateOutlet],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CubeWithTemplate {
    @Input() name = '';
    @Input() template?: TemplateRef<unknown>;
    //    @ContentChild(TemplateRef) template?: TemplateRef<unknown>;
}

@Component({
    selector: 'sandbox-test-scene',
    standalone: true,
    template: `
        <!-- <ngt-mesh -->
        <!-- *ref="ref" -->
        <!-- [position]="[1, 1, 1]" -->
        <!-- (click)="active = !active" -->
        <!-- [scale]="active ? 1.5 : 1" -->
        <!-- (beforeRender)="onBeforeRender()" -->
        <!-- > -->
        <!-- <ng-container *ref="geometryRef"> -->
        <!-- <ngt-box-geometry *args="[2, 2, 2]"></ngt-box-geometry> -->
        <!-- </ng-container> -->
        <!-- <ngt-mesh-basic-material -->
        <!-- *ngIf="!useNormal; else normal" -->
        <!-- color="hotpink" -->
        <!-- ></ngt-mesh-basic-material> -->
        <!-- <ng-template #normal> -->
        <!-- <ngt-mesh-normal-material></ngt-mesh-normal-material> -->
        <!-- </ng-template> -->
        <!-- </ngt-mesh> -->

        <ng-template #first>
            <ngt-mesh [position]="[-2, 1, 1]">
                <ngt-box-geometry *args="[0.5, 0.5, 0.5]" />
                <ngt-mesh-basic-material color="darkred" />
            </ngt-mesh>
        </ng-template>

        <ng-template #second>
            <ngt-mesh [position]="[-2, 1, 1]">
                <ngt-box-geometry *args="[2, 2, 2]" />
                <ngt-mesh-basic-material color="goldenrod" />
            </ngt-mesh>
        </ng-template>

        <ngts-center [position]="[1, -1, 1]">
            <ngts-box *ngIf="true" (beforeRender)="onBeforeRender($any($event).object)" [position]="[1, 1, 1]">
                <ngt-mesh-basic-material color="red" />
                <ngt-mesh [position]="[-2, -2, -2]">
                    <ngt-box-geometry *args="[2, 2, 2]" />
                    <ngt-mesh-basic-material color="blue" />
                </ngt-mesh>
                <ngts-box [position]="[-2, 2, -2]" />

                <sandbox-cube-with-template [template]="first" />
            </ngts-box>
            <ngts-box [position]="[1, 1, -1]">
                <ngt-mesh-normal-material />
                <ngts-center [position]="[-2, -2, 2]">
                    <ngts-box />
                    <ngt-mesh [position]="[-2, 0, 0]">
                        <ngt-box-geometry *args="[2, 2, 2]" />
                        <ngts-box [position]="[0, 4, 0]" />
                    </ngt-mesh>
                </ngts-center>
            </ngts-box>
            <sandbox-cube-with-template [template]="second" />
        </ngts-center>

        <!-- <ng-template #template> -->
        <!-- <ngt-mesh [position]="[-2, 1, 1]" name="the-mesh"> -->
        <!-- <ngt-box-geometry *args="[2, 2, 2]" /> -->
        <!-- <ngt-mesh-basic-material color="goldenrod" /> -->
        <!-- </ngt-mesh> -->
        <!-- </ng-template> -->

        <!-- <sandbox-cube-with-template name="outer-cube"> -->
        <!-- <sandbox-cube-with-template name="inner-cube" [template]="template"> </sandbox-cube-with-template> -->
        <!-- </sandbox-cube-with-template> -->

        <!-- <ngts-center> -->
        <!-- <sandbox-cube> -->
        <!-- <ngts-box [position]="[1, 0, 1]"></ngts-box> -->
        <!-- </sandbox-cube> -->
        <!-- <sandbox-cube *ngIf="true"></sandbox-cube> -->
        <!-- </ngts-center> -->
    `,
    imports: [NgtArgs, NgIf, Box, Center, Cube, CubeWithTemplate],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene implements OnInit {
    readonly #cdr = inject(ChangeDetectorRef);
    readonly store = injectNgtStore();

    useNormal = true;
    active = false;

    ngOnInit() {
        console.log(this.store);
        setTimeout(() => {
            this.useNormal = false;
            this.#cdr.detectChanges();
        }, 2000);
    }

    onBeforeRender(obj: Mesh) {
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
    }
}
