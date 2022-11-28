import {
    defaultProjector,
    injectInstance,
    NgtInstance,
    NgtObservableInput,
    NgtRef,
    NgtStore,
    NgtWrapper,
    provideInstanceRef,
    provideIsWrapper,
    tapEffect,
} from '@angular-three/core';
import { NgtOrthographicCamera } from '@angular-three/core/cameras';
import { NgtGroup } from '@angular-three/core/objects';
import { SobaFBO } from '@angular-three/soba/misc';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, inject, Input, NgZone, OnInit } from '@angular/core';
import { filter, tap } from 'rxjs';
import * as THREE from 'three';
import { SobaCameraContent } from '../camera/camera-content';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS } from '../common';

@Component({
    selector: 'ngt-soba-orthographic-camera',
    standalone: true,
    template: `
        <ngt-orthographic-camera *wrapper="this" [left]="left$" [right]="right$" [top]="top$" [bottom]="bottom$">
            <ng-container
                *ngIf="cameraContent && !cameraContent.sobaCameraContent"
                [ngTemplateOutlet]="cameraContent.templateRef"
            ></ng-container>
        </ngt-orthographic-camera>
        <ngt-group [ref]="instance.readKey('groupRef')" #group>
            <ng-container
                *ngIf="cameraContent && cameraContent.sobaCameraContent"
                [ngTemplateOutlet]="cameraContent.templateRef"
                [ngTemplateOutletContext]="{ $implicit: instance.readKey('fboRef'), group }"
            ></ng-container>
        </ngt-group>
    `,
    imports: [NgtOrthographicCamera, NgtWrapper, NgtGroup, NgIf, NgTemplateOutlet],
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(SobaOrthographicCamera), provideIsWrapper(), SobaFBO],
})
export class SobaOrthographicCamera extends NgtOrthographicCamera implements OnInit {
    @Input() set makeDefault(makeDefault: NgtObservableInput<boolean>) {
        this.instance.write({ makeDefault });
    }

    @Input() set manual(manual: NgtObservableInput<boolean>) {
        this.instance.write({ manual });
    }

    @Input() set frames(frames: NgtObservableInput<boolean>) {
        this.instance.write({ frames });
    }

    @Input() set resolution(resolution: NgtObservableInput<boolean>) {
        this.instance.write({ resolution });
    }

    @Input() set envMap(envMap: NgtObservableInput<THREE.Texture>) {
        this.instance.write({ envMap });
    }

    @ContentChild(SobaCameraContent) cameraContent?: SobaCameraContent;

    protected readonly instance = injectInstance({ host: true });
    private readonly store = inject(NgtStore);
    private readonly zone = inject(NgZone);
    private readonly __fbo__ = inject(SobaFBO);

    readonly left$ = this.instance.select(
        this.store.select((s) => s.size),
        this.instance.select((s) => s['left']),
        (size, left) => left ?? size.width / -2,
        { debounce: true }
    );

    readonly right$ = this.instance.select(
        this.store.select((s) => s.size),
        this.instance.select((s) => s['right']),
        (size, left) => left ?? size.width / 2,
        { debounce: true }
    );

    readonly top$ = this.instance.select(
        this.store.select((s) => s.size),
        this.instance.select((s) => s['top']),
        (size, left) => left ?? size.height / 2,
        { debounce: true }
    );

    readonly bottom$ = this.instance.select(
        this.store.select((s) => s.size),
        this.instance.select((s) => s['bottom']),
        (size, left) => left ?? size.height / -2,
        { debounce: true }
    );

    private readonly __setDefaultCamera__ = this.instance.effect(
        tapEffect(() => {
            if (this.instance.read((s) => s['makeDefault'])) {
                const { camera: oldCamera, cameraRef: oldCameraRef } = this.store.read();
                this.store.write({ camera: this, cameraRef: this.instance.instanceRef });
                return () => this.store.write({ camera: oldCamera, cameraRef: oldCameraRef });
            }
        })
    );

    private readonly __updateProjectionMatrix__ = this.instance.effect(
        tap(() => {
            if (!this.instance.read((s) => s['manual'])) {
                this.updateProjectionMatrix();
            }
        })
    );

    private readonly __setFBO__ = this.instance.effect(
        tap(() => {
            const resolution = this.instance.read((s) => s['resolution']);
            console.log(this.__fbo__);
            this.instance.write({
                fboRef: this.__fbo__.use(() => ({ width: resolution })),
            });
        })
    );

    constructor() {
        super();
        this.instance.write({
            resolution: 256,
            frames: Infinity,
            makeDefault: false,
            manual: false,
            groupRef: new NgtRef(),
            fboRef: new NgtRef(),
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.updateProjectionMatrix();
            this.__setFBO__(this.instance.select((s) => s['resolution']));
            const instanceRef$ = this.instance.instanceRef.pipe(filter((instance) => !!instance));
            this.__setDefaultCamera__(
                this.instance.select(
                    this.instance.select((s) => s['makeDefault']),
                    instanceRef$,
                    defaultProjector,
                    { debounce: true }
                )
            );
            this.__updateProjectionMatrix__(
                this.instance.select(
                    this.instance.select((s) => s['manual']),
                    instanceRef$,
                    defaultProjector,
                    { debounce: true }
                )
            );
        });
    }
}
