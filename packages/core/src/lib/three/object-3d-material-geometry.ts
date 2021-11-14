import { AfterContentInit, Directive, Input } from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor, UnknownRecord } from '../models';
import { NgtObject3d } from './object-3d';

@Directive()
export abstract class NgtObject3dMaterialGeometry<
    TObject extends THREE.Object3D = THREE.Object3D
  >
  extends NgtObject3d<TObject>
  implements AfterContentInit
{
  abstract get objectType(): AnyConstructor<TObject>;

  @Input() geometry?: string | THREE.BufferGeometry | null;
  @Input() material?:
    | string
    | string[]
    | THREE.Material
    | THREE.Material[]
    | null;
  @Input() morphTargetInfluences?: number[];
  @Input() morphTargetDictionary?: { [key: string]: number };

  private _objectMaterialGeometry!: TObject;

  private _extraArgs?: unknown[];
  set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  ngAfterContentInit() {
    this.init();
  }

  protected initObject() {
    if (this.canCreate()) {
      const material = this.getMaterial();
      const geometry = this.getGeometry();

      this._objectMaterialGeometry = new this.objectType(
        geometry,
        material,
        ...(this._extraArgs || [])
      );

      if (
        this.morphTargetDictionary &&
        'morphTargetDictionary' in this._objectMaterialGeometry
      ) {
        (this._objectMaterialGeometry as UnknownRecord).morphTargetDictionary =
          this.morphTargetDictionary;
      }

      if (
        this.morphTargetInfluences &&
        'morphTargetInfluences' in this._objectMaterialGeometry
      ) {
        (this._objectMaterialGeometry as UnknownRecord).morphTargetInfluences =
          this.morphTargetInfluences;
      }

      if (this.customize) {
        this.customize();
      }
    }
  }

  protected customize?: () => void;

  protected canCreate() {
    return true;
  }

  get object3d(): TObject {
    return this._objectMaterialGeometry;
  }

  private getMaterial(): THREE.Material[] | THREE.Material | undefined {
    if (this.material) {
      if (
        (Array.isArray(this.material) &&
          this.material[0] instanceof THREE.Material) ||
        this.material instanceof THREE.Material
      ) {
        return this.material as THREE.Material | THREE.Material[];
      }

      if (Array.isArray(this.material)) {
        return (this.material as string[]).map(
          (materialId) =>
            this.instancesStore.getImperativeState().materials[materialId]
        );
      }

      return this.instancesStore.getImperativeState().materials[this.material];
    }

    return undefined;
  }

  private getGeometry(): THREE.BufferGeometry | undefined {
    if (this.geometry) {
      if (this.geometry instanceof THREE.BufferGeometry) {
        return this.geometry;
      }

      return this.instancesStore.getImperativeState().geometries[this.geometry];
    }
    return undefined;
  }
}
