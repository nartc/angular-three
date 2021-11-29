// GENERATED
import {
  AfterContentInit,
  ContentChild,
  ContentChildren,
  Directive,
  Inject,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  OnInit,
  QueryList,
} from '@angular/core';
import * as THREE from 'three';
import { BufferGeometry, Material } from 'three';
import { AnyConstructor, AnyExtenderFunction, UnknownRecord } from '../models';
import { NgtInstancesStore } from '../stores/instances.store';
import { NgtGeometry } from '../three/geometry';
import { NgtMaterial } from '../three/material';
import { Controller, createControllerProviderFactory } from './controller';
import {
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObject3dController,
} from './object-3d.controller';

@Directive({
  selector: `
    ngt-mesh,
    ngt-instanced-mesh,
    ngt-skinned-mesh,
  `,
  exportAs: 'ngtMaterialGeometryController',
  providers: [NGT_OBJECT_CONTROLLER_PROVIDER],
})
export class NgtMaterialGeometryController
  extends Controller
  implements AfterContentInit, OnInit
{
  @ContentChildren(NgtMaterial, { descendants: true }) set materialDirectives(
    v: QueryList<NgtMaterial>
  ) {
    if (this.material == null && v) {
      this.material =
        v.length === 1
          ? v.first.material
          : v.toArray().map((dir) => dir.material);
    }
  }

  @ContentChild(NgtGeometry)
  set bufferGeometryDirective(v: NgtGeometry) {
    if (this.geometry == null && v) {
      this.geometry = v.geometry;
    }
  }

  #geometryInput?: string | THREE.BufferGeometry | undefined;

  @Input() set geometry(v: string | THREE.BufferGeometry | undefined) {
    this.#geometryInput = v;
    this.#geometry = this.#getGeometry(v);
  }

  get geometry() {
    return this.#geometry;
  }

  #geometry: THREE.BufferGeometry | undefined = undefined;

  #materialInput?:
    | string
    | string[]
    | THREE.Material
    | THREE.Material[]
    | undefined;

  @Input() set material(
    v: string | string[] | THREE.Material | THREE.Material[] | undefined
  ) {
    if (!(Array.isArray(v) && !v.length)) {
      this.#materialInput = v;
    }
    this.#material = this.#getMaterial(v);
  }

  get material() {
    return this.#material;
  }

  #material: THREE.Material | THREE.Material[] | undefined = undefined;

  #meshArgs: unknown[] = [];
  set meshArgs(v: unknown | unknown[]) {
    this.#meshArgs = Array.isArray(v) ? v : [v];
  }

  @Input() materialGeometryController?: NgtMaterialGeometryController;

  @Input() morphTargetInfluences?: number[];
  @Input() morphTargetDictionary?: { [key: string]: number };

  constructor(
    ngZone: NgZone,
    private instancesStore: NgtInstancesStore,
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    public objectController: NgtObject3dController,
    @Inject(NGT_OBJECT_TYPE)
    public objectType: AnyConstructor<THREE.Object3D>,
    @Inject(NGT_OBJECT_POST_INIT)
    public objectPostInit: AnyExtenderFunction<THREE.Object3D> | undefined
  ) {
    super(ngZone);
  }

  ngOnInit() {
    super.ngOnInit();
    this.objectController.initFn = () => {
      if (!this.geometry) {
        this.#geometry = this.#getGeometry(this.#geometryInput);
      }

      if (!this.material) {
        this.#material = this.#getMaterial(this.#materialInput);
      }

      const object = new this.objectType(
        this.geometry,
        this.material,
        ...this.#meshArgs
      );

      if (this.morphTargetDictionary && 'morphTargetDictionary' in object) {
        (object as unknown as UnknownRecord).morphTargetDictionary =
          this.morphTargetDictionary;
      }

      if (this.morphTargetInfluences && 'morphTargetInfluences' in object) {
        (object as unknown as UnknownRecord).morphTargetInfluences =
          this.morphTargetInfluences;
      }

      if (this.objectPostInit) {
        this.objectPostInit(object);
      }

      return object;
    };
  }

  ngAfterContentInit() {
    this.objectController.init();
  }

  #getMaterial(
    input: string | string[] | Material | Material[] | undefined
  ): Material | Material[] | undefined {
    if (input) {
      if (Array.isArray(input)) {
        if (!input.length) return undefined;

        if (input[0] instanceof THREE.Material) {
          return input as THREE.Material[];
        }

        return (input as string[]).map(
          (materialId) =>
            this.instancesStore.getImperativeState().materials[materialId]
        );
      }

      if (input instanceof THREE.Material) {
        return input;
      }

      return this.instancesStore.getImperativeState().materials[input];
    }

    return undefined;
  }

  #getGeometry(
    input: string | BufferGeometry | undefined
  ): BufferGeometry | undefined {
    if (input) {
      if (input instanceof THREE.BufferGeometry) {
        return input;
      }

      return this.instancesStore.getImperativeState().geometries[input];
    }

    return undefined;
  }

  get controller(): Controller | undefined {
    return this.materialGeometryController;
  }

  get props(): string[] {
    return [
      'material',
      'geometry',
      'morphTargetInfluences',
      'morphTargetDictionary',
    ];
  }
}

@NgModule({
  declarations: [NgtMaterialGeometryController],
  exports: [NgtMaterialGeometryController],
})
export class NgtMaterialGeometryControllerModule {}

export const [
  NGT_MATERIAL_GEOMETRY_WATCHED_CONTROLLER,
  NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
] = createControllerProviderFactory({
  watchedControllerTokenName: 'Watched MaterialGeometryController',
  controller: NgtMaterialGeometryController,
});

export const NGT_OBJECT_TYPE = new InjectionToken('Object3d Type', {
  providedIn: 'root',
  factory: () => THREE.Object3D,
});

export const NGT_OBJECT_POST_INIT = new InjectionToken('Object3d PostInit', {
  providedIn: 'root',
  factory: () => undefined,
});
