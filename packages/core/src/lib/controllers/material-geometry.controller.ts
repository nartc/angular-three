// GENERATED
import {
  Directive,
  Inject,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  OnInit,
} from '@angular/core';
import * as THREE from 'three';
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

export const NGT_OBJECT_TYPE = new InjectionToken('Object Type', {
  providedIn: 'root',
  factory: () => THREE.Object3D,
});

export const NGT_OBJECT_POST_INIT = new InjectionToken('Object PostInit', {
  providedIn: 'root',
  factory: () => undefined,
});

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

  @Input() morphTargetInfluences?: number[];
  @Input() morphTargetDictionary?: { [key: string]: number };

  private materialController!: NgtWithMaterialController;
  private geometryController!: NgtWithGeometryController;

  constructor(
    zone: NgZone,
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    public objectController: NgtObjectController,
    @Inject(NGT_OBJECT_TYPE)
    private objectType: AnyConstructor<THREE.Object3D>,
    @Inject(NGT_OBJECT_POST_INIT)
    private objectPostInit: AnyExtenderFunction<THREE.Object3D> | undefined,
    @Inject(NGT_WITH_MATERIAL_WATCHED_CONTROLLER)
    withMaterialController: NgtWithMaterialController,
    @Inject(NGT_WITH_GEOMETRY_WATCHED_CONTROLLER)
    withGeometryController: NgtWithGeometryController
  ) {
    super(zone);

    objectController.initFn = () => {
      this.materialController =
        withMaterialController.withMaterialController ?? withMaterialController;
      this.geometryController =
        withGeometryController.withGeometryController ?? withGeometryController;

      if (!this.materialController.material) {
        this.materialController.construct();
      }

      const object = new this.objectType(
        this.geometryController.geometry,
        this.materialController.material,
        ...this.meshArgs
      );

      if (this.morphTargetDictionary && 'morphTargetDictionary' in object) {
        (object as unknown as UnknownRecord)['morphTargetDictionary'] =
          this.morphTargetDictionary;
      }

      if (this.morphTargetInfluences && 'morphTargetInfluences' in object) {
        (object as unknown as UnknownRecord)['morphTargetInfluences'] =
          this.morphTargetInfluences;
      }

      if (this.objectPostInit) {
        zone.runOutsideAngular(() => {
          this.objectPostInit!(object);
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

  override ngOnInit() {
    super.ngOnInit();
    this.objectController.init();
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
