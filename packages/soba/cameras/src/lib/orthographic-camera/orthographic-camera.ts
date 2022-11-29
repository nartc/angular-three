import {
    defaultProjector,
    filterFalsy,
    NgtCompound,
    NgtObjectCompound,
    NgtObservableInput,
    NgtRef,
    NgtStore,
    provideInstanceRef,
    tapEffect,
} from '@angular-three/core';
import { NgtOrthographicCamera } from '@angular-three/core/cameras';
import { NgtGroup } from '@angular-three/core/objects';
import { SobaFBO } from '@angular-three/soba/misc';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, inject, Input, NgZone, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
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
export class SobaOrthographicCamera extends NgtCompound<NgtOrthographicCamera> implements OnInit {
    @Input() set makeDefault(makeDefault: NgtObservableInput<boolean>) {
        this.write({ makeDefault });
    }

    @Input() set manual(manual: NgtObservableInput<boolean>) {
        this.write({ manual });
    }

    @Input() set frames(frames: NgtObservableInput<boolean>) {
        this.write({ frames });
    }

    @Input() set resolution(resolution: NgtObservableInput<boolean>) {
        this.write({ resolution });
    }

    @Input() set envMap(envMap: NgtObservableInput<THREE.Texture>) {
        this.write({ envMap });
    }

    @ContentChild(SobaCameraContent) cameraContent?: SobaCameraContent;

    private readonly store = inject(NgtStore);
    private readonly zone = inject(NgZone);
    private readonly fbo = inject(SobaFBO);

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

    private readonly setDefaultCamera = this.effect(
        tapEffect(() => {
            if (this.read((s) => s['makeDefault'])) {
                const { camera: oldCamera, cameraRef: oldCameraRef } = this.store.read();
                this.store.write({ camera: this, cameraRef: this.instanceRef });
                return () => this.store.write({ camera: oldCamera, cameraRef: oldCameraRef });
            }
        })
    );

    private readonly updateProjectionMatrix = this.effect(
        tap(() => {
            if (!this.read((s) => s['manual'])) {
                this.instanceRef.value.updateProjectionMatrix();
            }
        })
    );

    private readonly setFBO = this.effect(
        tap(() => {
            const resolution = this.read((s) => s['resolution']);
            this.write({
                fboRef: this.fbo.use(() => ({ width: resolution })),
            });
        })
    );

    override initialize() {
        super.initialize();
        this.write({
            resolution: 256,
            frames: Infinity,
            makeDefault: false,
            manual: false,
            groupRef: new NgtRef(),
            fboRef: new NgtRef(),
        });
    }

    override get useOnHost(): (keyof NgtOrthographicCamera | string)[] {
        return [...super.useOnHost, 'left', 'right', 'top', 'bottom'];
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
                this.instanceRef.value.updateProjectionMatrix();
            });
            this.setFBO(this.select((s) => s['resolution']));
            const instanceRef$ = this.instanceRef.pipe(filterFalsy());
            this.setDefaultCamera(
                this.select(
                    this.select((s) => s['makeDefault']),
                    instanceRef$,
                    defaultProjector,
                    { debounce: true }
                )
            );
            this.updateProjectionMatrix(
                this.select(
                    this.select((s) => s['manual']),
                    instanceRef$,
                    defaultProjector,
                    { debounce: true }
                )
            );
        });
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
