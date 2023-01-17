import { NgtcPhysics } from '@angular-three/cannon';
import { NgtcDebug } from '@angular-three/cannon/debug';
import { injectCylinder, injectPlane } from '@angular-three/cannon/services';
import { extend, injectNgtDestroy, NgtArgs } from '@angular-three/core';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { NgtsEnvironment } from '@angular-three/soba/staging';
import { DOCUMENT, NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit } from '@angular/core';
import { CylinderArgs, Triplet } from '@pmndrs/cannon-worker-api';
import { fromEvent, takeUntil } from 'rxjs';
import {
    AmbientLight,
    Color,
    CylinderGeometry,
    Fog,
    Group,
    Mesh,
    MeshNormalMaterial,
    MeshStandardMaterial,
    PlaneGeometry,
    SpotLight,
} from 'three';
import { Vehicle } from './vehicle.component';

extend({
    Color,
    Fog,
    Mesh,
    Group,
    CylinderGeometry,
    PlaneGeometry,
    MeshStandardMaterial,
    MeshNormalMaterial,
    AmbientLight,
    SpotLight,
});

// TODO Generally, we want to be able to pass [ref] down to a component and the Physics will use that ref.
// Due to Angular Inputs, we have some hacks here with Output and reassign the nativeElement on the Ref instead.

@Component({
    selector: 'sandbox-plane',
    standalone: true,
    template: `
        <ngt-group [ref]="plane.ref">
            <ngt-mesh receiveShadow>
                <ngt-plane-geometry *args="[100, 100]" />
                <ngt-mesh-standard-material color="#303030" />
            </ngt-mesh>
        </ngt-group>
    `,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Plane {
    @Input() rotation: Triplet = [0, 0, 0];
    readonly plane = injectPlane<Group>(() => ({
        material: 'ground',
        type: 'Static',
        rotation: this.rotation,
        userData: { id: 'floor' },
    }));
}

@Component({
    selector: 'sandbox-pillar',
    standalone: true,
    template: `
        <ngt-mesh [ref]="cylinder.ref" castShadow>
            <ngt-cylinder-geometry *args="args" />
            <ngt-mesh-normal-material />
        </ngt-mesh>
    `,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Pillar {
    @Input() position: Triplet = [0, 0, 0];
    @Input() userData: Record<string, unknown> = {};
    readonly args: CylinderArgs = [0.7, 0.7, 5, 16];
    readonly cylinder = injectCylinder<Mesh>(() => ({
        args: this.args,
        mass: 10,
        position: this.position,
        userData: this.userData,
    }));
}

@Component({
    selector: 'sandbox-raycast-vehicle-scene',
    standalone: true,
    template: `
        <ngt-color *args="['#171720']" attach="background" />
        <ngt-fog *args="['#171720', 10, 50]" attach="fog" />

        <ngt-ambient-light intensity="0.1" />
        <ngt-spot-light [position]="[10, 10, 10]" angle="0.5" intensity="1" penumbra="1" castShadow />

        <ngtc-physics
            broadphase="SAP"
            [defaultContactMaterial]="{ contactEquationRelaxation: 4, friction: 1e-3 }"
            [allowSleep]="true"
        >
            <ngtc-debug [disabled]="isDebugDisabled">
                <sandbox-plane [rotation]="[-Math.PI / 2, 0, 0]" />
                <sandbox-vehicle
                    [position]="[0, 2, 0]"
                    [rotation]="[0, -Math.PI / 4, 0]"
                    [angularVelocity]="[0, 0.5, 0]"
                />
                <sandbox-pillar *ngIf="true" [position]="[-5, 2.5, -5]" [userData]="{ id: 'pillar-1' }" />
                <sandbox-pillar [position]="[0, 2.5, -5]" [userData]="{ id: 'pillar-2' }" />
                <sandbox-pillar [position]="[5, 2.5, -5]" [userData]="{ id: 'pillar-3' }" />
            </ngtc-debug>
        </ngtc-physics>
        <ngts-environment preset="night" />
        <ngts-orbit-controls />
    `,
    imports: [NgtArgs, NgtcPhysics, NgIf, Plane, Pillar, Vehicle, NgtcDebug, NgtsEnvironment, NgtsOrbitControls],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene implements OnInit {
    isDebugDisabled = true;

    readonly ngtDestroy = injectNgtDestroy();
    readonly document = inject(DOCUMENT);

    readonly Math = Math;

    ngOnInit() {
        fromEvent<KeyboardEvent>(this.document.defaultView!, 'keyup')
            .pipe(takeUntil(this.ngtDestroy[0]))
            .subscribe((e) => {
                if (e.key === '?') {
                    this.isDebugDisabled = !this.isDebugDisabled;
                    this.ngtDestroy[1].detectChanges();
                }
            });
    }
}
