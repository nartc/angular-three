import { injectBox, injectRaycastVehicle } from '@angular-three/cannon/services';
import { extend, injectNgtDestroy, injectNgtRef } from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit } from '@angular/core';
import { Triplet, WheelInfoOptions } from '@pmndrs/cannon-worker-api';
import { fromEvent, ReplaySubject, takeUntil } from 'rxjs';
import { Group, Mesh } from 'three';
import { Chassis } from './chassis.component';
import { Wheel } from './wheel';

const keyControlMap = {
    ' ': 'brake',
    ArrowDown: 'backward',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'forward',
    r: 'reset',
    w: 'forward',
    s: 'backward',
    a: 'left',
    d: 'right',
} as const;

type KeyCode = keyof typeof keyControlMap;

const keyCodes = Object.keys(keyControlMap) as KeyCode[];
const isKeyCode = (v: unknown): v is KeyCode => keyCodes.includes(v as KeyCode);

extend({ Group });

@Component({
    selector: 'sandbox-vehicle',
    standalone: true,
    template: `
        <ngt-group [ref]="vehicle.ref" [position]="[0, -0.4, 0]" (beforeRender)="onBeforeRender()">
            <sandbox-chassis [ref]="chassis.ref" (beetle)="chassisReady.next()" />
            <sandbox-wheel (ref)="wheels[0].nativeElement = $event" [radius]="radius" [leftSide]="true" />
            <sandbox-wheel (ref)="wheels[1].nativeElement = $event" [radius]="radius" />
            <sandbox-wheel (ref)="wheels[2].nativeElement = $event" [radius]="radius" [leftSide]="true" />
            <sandbox-wheel (ref)="wheels[3].nativeElement = $event" [radius]="radius" />
        </ngt-group>
    `,
    imports: [Chassis, Wheel],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Vehicle implements OnInit {
    @Input() position: Triplet = [0, 0, 0];
    @Input() rotation: Triplet = [0, 0, 0];
    @Input() angularVelocity: Triplet = [0, 0, 0];

    readonly ngtDestroy = injectNgtDestroy();
    readonly document = inject(DOCUMENT);
    readonly chassisReady = new ReplaySubject<void>(1);

    readonly radius = 0.7;

    private back = -1.15;
    private force = 1500;
    private front = 1.3;
    private height = -0.04;
    private maxBrake = 50;
    private steer = 0.5;
    private width = 1.2;
    private backward = false;
    private brake = false;
    private forward = false;
    private left = false;
    private reset = false;
    private right = false;

    wheelInfo: WheelInfoOptions = {
        axleLocal: [-1, 0, 0], // This is inverted for asymmetrical wheel models (left v. right sided)
        customSlidingRotationalSpeed: -30,
        dampingCompression: 4.4,
        dampingRelaxation: 10,
        directionLocal: [0, -1, 0], // set to same as Physics Gravity
        frictionSlip: 2,
        maxSuspensionForce: 1e4,
        maxSuspensionTravel: 0.3,
        radius: this.radius,
        suspensionRestLength: 0.3,
        suspensionStiffness: 30,
        useCustomSlidingRotationalSpeed: true,
    };

    wheelInfo1: WheelInfoOptions = {
        ...this.wheelInfo,
        chassisConnectionPointLocal: [-this.width / 2, this.height, this.front],
        isFrontWheel: true,
    };
    wheelInfo2: WheelInfoOptions = {
        ...this.wheelInfo,
        chassisConnectionPointLocal: [this.width / 2, this.height, this.front],
        isFrontWheel: true,
    };
    wheelInfo3: WheelInfoOptions = {
        ...this.wheelInfo,
        chassisConnectionPointLocal: [-this.width / 2, this.height, this.back],
        isFrontWheel: false,
    };
    wheelInfo4: WheelInfoOptions = {
        ...this.wheelInfo,
        chassisConnectionPointLocal: [this.width / 2, this.height, this.back],
        isFrontWheel: false,
    };

    readonly wheels = [injectNgtRef<Group>(), injectNgtRef<Group>(), injectNgtRef<Group>(), injectNgtRef<Group>()];

    readonly chassis = injectBox<Mesh>(
        () => ({
            allowSleep: false,
            angularVelocity: this.angularVelocity,
            args: [1.7, 1, 4],
            mass: 500,
            onCollide: (e) => console.log('bonk', e.body.userData),
            position: this.position,
            rotation: this.rotation,
        }),
        { waitFor: this.chassisReady }
    );

    readonly vehicle = injectRaycastVehicle(() => ({
        chassisBody: this.chassis.ref,
        wheelInfos: [this.wheelInfo1, this.wheelInfo2, this.wheelInfo3, this.wheelInfo4],
        wheels: this.wheels,
    }));

    onBeforeRender() {
        const {
            forward,
            backward,
            force,
            left,
            right,
            steer,
            brake,
            maxBrake,
            position,
            angularVelocity,
            rotation,
            reset,
            chassis,
            vehicle,
        } = this;

        if (
            vehicle.ref.nativeElement &&
            chassis.ref.nativeElement &&
            this.wheels.every((wheel) => wheel.nativeElement)
        ) {
            for (let e = 2; e < 4; e++) {
                vehicle.api.applyEngineForce(forward || backward ? force * (forward && !backward ? -1 : 1) : 0, 2);
            }

            for (let s = 0; s < 2; s++) {
                vehicle.api.setSteeringValue(left || right ? steer * (left && !right ? 1 : -1) : 0, s);
            }

            for (let b = 2; b < 4; b++) {
                vehicle.api.setBrake(brake ? maxBrake : 0, b);
            }

            if (reset) {
                chassis.api.position.set(...position);
                chassis.api.velocity.set(0, 0, 0);
                chassis.api.angularVelocity.set(...angularVelocity);
                chassis.api.rotation.set(...rotation);
            }
        }
    }

    ngOnInit(): void {
        fromEvent<KeyboardEvent>(this.document.defaultView!, 'keyup')
            .pipe(takeUntil(this.ngtDestroy[0]))
            .subscribe((e) => {
                if (!isKeyCode(e.key)) return;
                this[keyControlMap[e.key]] = false;
            });
        fromEvent<KeyboardEvent>(this.document.defaultView!, 'keydown')
            .pipe(takeUntil(this.ngtDestroy[0]))
            .subscribe((e) => {
                if (!isKeyCode(e.key)) return;
                this[keyControlMap[e.key]] = true;
            });
    }
}
