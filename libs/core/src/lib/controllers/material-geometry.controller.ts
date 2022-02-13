// GENERATED
import {
    Directive,
    Inject,
    Input,
    NgModule,
    NgZone,
    OnInit,
} from '@angular/core';
import * as THREE from 'three';
import { NGT_OBJECT_POST_INIT, NGT_OBJECT_TYPE } from '../di/object-init';
import type {
    AnyConstructor,
    AnyExtenderFunction,
    UnknownRecord,
} from '../types';
import { Controller, createControllerProviderFactory } from './controller';
import {
    NGT_OBJECT_CONTROLLER_PROVIDER,
    NGT_OBJECT_WATCHED_CONTROLLER,
    NgtObjectController,
    NgtObjectControllerModule,
} from './object.controller';
import {
    NGT_WITH_GEOMETRY_CONTROLLER_PROVIDER,
    NGT_WITH_GEOMETRY_WATCHED_CONTROLLER,
    NgtWithGeometryController,
    NgtWithGeometryControllerModule,
} from './with-geometry.controller';
import {
    NGT_WITH_MATERIAL_CONTROLLER_PROVIDER,
    NGT_WITH_MATERIAL_WATCHED_CONTROLLER,
    NgtWithMaterialController,
    NgtWithMaterialControllerModule,
} from './with-material.controller';

@Directive({
    selector: `
    ngt-mesh,
    ngt-instanced-mesh,
    ngt-skinned-mesh,
    ngt-line,
    ngt-line-loop,
    ngt-line-segments,
    ngt-points
  `,
    exportAs: 'ngtMaterialGeometryController',
    providers: [
        NGT_OBJECT_CONTROLLER_PROVIDER,
        NGT_WITH_MATERIAL_CONTROLLER_PROVIDER,
        NGT_WITH_GEOMETRY_CONTROLLER_PROVIDER,
    ],
})
export class NgtMaterialGeometryController
    extends Controller
    implements OnInit
{
    private _meshArgs: unknown[] = [];
    set meshArgs(v: unknown | unknown[]) {
        this._meshArgs = Array.isArray(v) ? v : [v];
    }

    get meshArgs(): unknown[] {
        return this._meshArgs;
    }

    @Input() isMultipleMaterials = false;
    @Input() morphTargetInfluences?: number[];
    @Input() morphTargetDictionary?: Record<string, number>;

    constructor(
        zone: NgZone,
        @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
        private objectController: NgtObjectController,
        @Inject(NGT_OBJECT_TYPE)
        objectType: AnyConstructor<THREE.Object3D>,
        @Inject(NGT_OBJECT_POST_INIT)
        objectPostInit: AnyExtenderFunction<THREE.Object3D> | undefined,
        @Inject(NGT_WITH_MATERIAL_WATCHED_CONTROLLER)
        withMaterialController: NgtWithMaterialController,
        @Inject(NGT_WITH_GEOMETRY_WATCHED_CONTROLLER)
        withGeometryController: NgtWithGeometryController
    ) {
        super();

        objectController.initFn = () => {
            if (!withMaterialController.material) {
                withMaterialController.construct();
            }

            let object: THREE.Object3D;

            if (this.isMultipleMaterials) {
                object = new objectType(
                    withGeometryController.geometry,
                    Array.isArray(withMaterialController.material)
                        ? withMaterialController.material
                        : withMaterialController.material
                        ? [withMaterialController.material]
                        : [],
                    ...this.meshArgs
                );
            } else {
                object = new objectType(
                    withGeometryController.geometry,
                    withMaterialController.material,
                    ...this.meshArgs
                );
            }

            if (
                this.morphTargetDictionary &&
                'morphTargetDictionary' in object
            ) {
                (object as unknown as UnknownRecord)['morphTargetDictionary'] =
                    this.morphTargetDictionary;
            }

            if (
                this.morphTargetInfluences &&
                'morphTargetInfluences' in object
            ) {
                (object as unknown as UnknownRecord)['morphTargetInfluences'] =
                    this.morphTargetInfluences;
            }

            if (objectPostInit) {
                zone.runOutsideAngular(() => {
                    objectPostInit!(object);
                });
            }

            return object;
        };

        objectController.readyFn = () => {
            if (this.readyFn) {
                this.readyFn();
            }
        };
    }

    ngOnInit() {
        this.objectController.init();
    }

    get object() {
        return this.objectController.object;
    }
}

@NgModule({
    declarations: [NgtMaterialGeometryController],
    exports: [
        NgtMaterialGeometryController,
        NgtObjectControllerModule,
        NgtWithMaterialControllerModule,
        NgtWithGeometryControllerModule,
    ],
})
export class NgtMaterialGeometryControllerModule {}

export const [
    NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER,
    NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
] = createControllerProviderFactory({
    watchedControllerTokenName: 'Watched MaterialGeometryController',
    controller: NgtMaterialGeometryController,
});
