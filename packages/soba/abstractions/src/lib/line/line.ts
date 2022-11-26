import {
    checkNeedsUpdate,
    injectInstance,
    NgtArgs,
    NgtEuler,
    NgtInstance,
    NgtLayers,
    NgtMatrix4,
    NgtObservableInput,
    NgtQuaternion,
    NgtStore,
    NgtVector2,
    NgtVector3,
    provideInstanceRef,
    proxify,
    tapEffect,
} from '@angular-three/core';
import { NgtObjectPrimitive, NgtPrimitive } from '@angular-three/core/primitives';
import { Component, inject, Input, NgZone, OnInit } from '@angular/core';
import { filter, Observable, pipe, tap } from 'rxjs';
import * as THREE from 'three';
import { Line2, LineGeometry } from 'three-stdlib';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';

@Component({
    selector: 'ngt-soba-line[points]',
    standalone: true,
    template: `
        <ngt-primitive *args="lineGeometryArgs$" attach="geometry"></ngt-primitive>
        <ngt-primitive *args="[material]" attach="material" [props]="lineMaterialProps$"></ngt-primitive>
    `,
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(SobaLine)],
    imports: [NgtObjectPrimitive, NgtPrimitive, NgtArgs],
    inputs: ['material', 'geometry', 'morphTargetInfluences', 'morphTargetDictionary', ...NGT_OBJECT3D_INPUTS],
})
export class SobaLine extends Line2 implements OnInit {
    @Input() set points(points: NgtObservableInput<Array<NgtVector3 | NgtVector2>>) {
        this.instance.write({ points });
    }

    @Input() set vertexColors(vertexColors: NgtObservableInput<Array<THREE.Color | [number, number, number]>>) {
        this.instance.write({ vertexColors });
    }

    @Input() set alphaToCoverage(alphaToCoverage: NgtObservableInput<boolean>) {
        this.instance.write({ alphaToCoverage });
    }

    @Input() set color(color: NgtObservableInput<number>) {
        this.instance.write({ color });
    }

    @Input() set dashed(dashed: NgtObservableInput<boolean>) {
        this.instance.write({ dashed });
    }

    @Input() set dashScale(dashScale: NgtObservableInput<number>) {
        this.instance.write({ dashScale });
    }

    @Input() set dashSize(dashSize: NgtObservableInput<number>) {
        this.instance.write({ dashSize });
    }

    @Input() set dashOffset(dashOffset: NgtObservableInput<number>) {
        this.instance.write({ dashOffset });
    }

    @Input() set gapSize(gapSize: NgtObservableInput<number>) {
        this.instance.write({ gapSize });
    }

    @Input() set linewidth(linewidth: NgtObservableInput<number>) {
        this.instance.write({ linewidth });
    }

    @Input() set resolution(resolution: NgtObservableInput<NgtVector2>) {
        this.instance.write({ resolution });
    }

    @Input() set wireframe(wireframe: NgtObservableInput<boolean>) {
        this.instance.write({ wireframe });
    }

    @Input() set worldUnits(worldUnits: NgtObservableInput<boolean>) {
        this.instance.write({ worldUnits });
    }

    protected readonly instance = injectInstance({ host: true });
    private readonly zone = inject(NgZone);
    private readonly store = inject(NgtStore);

    readonly lineGeometry$: Observable<LineGeometry> = this.instance.select(
        this.instance.select((s) => s['points']).pipe(filter((points) => !!points)),
        this.instance.select((s) => s['vertexColors']),
        (points, vertexColors) => {
            const geometry = new LineGeometry();

            const pValues = points.map((p: any) => {
                const isArray = Array.isArray(p);
                return p instanceof THREE.Vector3
                    ? [p.x, p.y, p.z]
                    : p instanceof THREE.Vector2
                    ? [p.x, p.y, 0]
                    : isArray && p.length === 3
                    ? [p[0], p[1], p[2]]
                    : isArray && p.length === 2
                    ? [p[0], p[1], 0]
                    : p;
            });

            geometry.setPositions(pValues.flat());

            if (vertexColors) {
                const cValues = vertexColors.map((c: THREE.ColorRepresentation) =>
                    c instanceof THREE.Color ? c.toArray() : c
                );
                geometry.setColors(cValues.flat());
            }

            return geometry;
        },
        { debounce: true }
    );
    readonly lineGeometryArgs$ = this.instance.select(this.lineGeometry$, (lineGeometry) => [lineGeometry], {
        debounce: true,
    });

    readonly lineMaterialProps$ = this.instance.select(
        {
            alphaToCoverage: this.instance.select((s) => s['alphaToCoverage']),
            color: this.instance.select((s) => s['color']),
            dashed: this.instance.select((s) => s['dashed']),
            dashScale: this.instance.select((s) => s['dashScale']),
            dashSize: this.instance.select((s) => s['dashSize']),
            dashOffset: this.instance.select((s) => s['dashOffset']),
            gapSize: this.instance.select((s) => s['gapSize']),
            linewidth: this.instance.select((s) => s['linewidth']),
            resolution: this.instance.select(
                this.instance.select((s) => s['resolution']),
                this.store.select((s) => s.size),
                (resolution, size) => resolution ?? [size.width, size.height]
            ),
            vertexColors: this.instance.select(
                this.instance.select((s) => s['vertexColors']),
                (vertexColors) => Boolean(vertexColors)
            ),
            wireframe: this.instance.select((s) => s['wireframe']),
            worldUnits: this.instance.select((s) => s['worldUnits']),
        },
        { debounce: true }
    );

    private readonly computeLineDistances_ = this.instance.effect<LineGeometry>(
        pipe(
            tap((lineGeometry) => {
                if (this.geometry.uuid !== lineGeometry.uuid) {
                    this.geometry = lineGeometry;
                }
                this.computeLineDistances();
            })
        )
    );

    private readonly disposeGeometry_ = this.instance.effect<LineGeometry>(
        tapEffect((lineGeometry) => () => lineGeometry.dispose())
    );

    private readonly setDashed_ = this.instance.effect(
        tap(() => {
            const dashed = this.instance.read((s) => s['dashed']);
            if (dashed) {
                this.material.defines['USE_DASH'] = '';
            } else {
                delete this.material.defines['USE_DASH'];
            }
            checkNeedsUpdate(this.material);
        })
    );

    constructor() {
        super();
        return proxify(this);
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.computeLineDistances_(
                this.instance.select(
                    this.lineGeometry$,
                    this.instance.instanceRef.pipe(filter((instance) => !!instance)),
                    this.instance.select((s) => s['points']).pipe(filter((points) => !!points)),
                    (lineGeometry) => lineGeometry,
                    { debounce: true }
                )
            );
            this.disposeGeometry_(this.lineGeometry$);
            this.setDashed_(this.instance.select((s) => s['dashed']));
        });
    }

    static ngAcceptInputType_geometry: NgtObservableInput<THREE.BufferGeometry>;
    static ngAcceptInputType_material: NgtObservableInput<THREE.Material | THREE.Material[]>;
    static ngAcceptInputType_morphTargetInfluences: NgtObservableInput<number[]> | undefined;
    static ngAcceptInputType_morphTargetDictionary: NgtObservableInput<{ [key: string]: number }> | undefined;
    static ngAcceptInputType_name: NgtObservableInput<string>;
    static ngAcceptInputType_position: NgtObservableInput<NgtVector3>;
    static ngAcceptInputType_rotation: NgtObservableInput<NgtEuler>;
    static ngAcceptInputType_quaternion: NgtObservableInput<NgtQuaternion>;
    static ngAcceptInputType_scale: NgtObservableInput<NgtVector3>;
    static ngAcceptInputType_modelViewMatrix: NgtObservableInput<NgtMatrix4>;
    static ngAcceptInputType_normalMatrix: NgtObservableInput<THREE.Matrix3>;
    static ngAcceptInputType_matrix: NgtObservableInput<NgtMatrix4>;
    static ngAcceptInputType_matrixWorld: NgtObservableInput<NgtMatrix4>;
    static ngAcceptInputType_matrixAutoUpdate: NgtObservableInput<boolean>;
    static ngAcceptInputType_matrixWorldAutoUpdate: NgtObservableInput<boolean>;
    static ngAcceptInputType_matrixWorldNeedsUpdate: NgtObservableInput<boolean>;
    static ngAcceptInputType_layers: NgtObservableInput<NgtLayers>;
    static ngAcceptInputType_visible: NgtObservableInput<boolean>;
    static ngAcceptInputType_castShadow: NgtObservableInput<boolean>;
    static ngAcceptInputType_receiveShadow: NgtObservableInput<boolean>;
    static ngAcceptInputType_frustumCulled: NgtObservableInput<boolean>;
    static ngAcceptInputType_renderOrder: NgtObservableInput<number>;
    static ngAcceptInputType_animations: NgtObservableInput<THREE.AnimationClip[]>;
    static ngAcceptInputType_userData: NgtObservableInput<{ [key: string]: any }>;
    static ngAcceptInputType_customDepthMaterial: NgtObservableInput<THREE.Material>;
    static ngAcceptInputType_customDistanceMaterial: NgtObservableInput<THREE.Material>;
    static ngAcceptInputType_onBeforeRender: NgtObservableInput<
        (
            renderer: THREE.WebGLRenderer,
            scene: THREE.Scene,
            camera: THREE.Camera,
            geometry: THREE.BufferGeometry,
            material: THREE.Material,
            group: THREE.Group
        ) => void
    >;
    static ngAcceptInputType_onAfterRender: NgtObservableInput<
        (
            renderer: THREE.WebGLRenderer,
            scene: THREE.Scene,
            camera: THREE.Camera,
            geometry: THREE.BufferGeometry,
            material: THREE.Material,
            group: THREE.Group
        ) => void
    >;
}
