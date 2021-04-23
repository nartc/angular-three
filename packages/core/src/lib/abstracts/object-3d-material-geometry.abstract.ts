import { AfterContentInit, Directive, Input } from '@angular/core';
import { BufferGeometry, Material, Object3D } from 'three';
import { AnyConstructor, UnknownRecord } from '../typings';
import { ThreeObject3d } from './object-3d.abstract';

@Directive()
export abstract class ThreeObject3dMaterialGeometry<
    TObject extends Object3D = Object3D
  >
  extends ThreeObject3d<TObject>
  implements AfterContentInit {
  abstract get objectType(): AnyConstructor<TObject>;

  @Input() geometry?: string | BufferGeometry | null;
  @Input() material?: string | string[] | Material | Material[] | null;
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
        (this
          ._objectMaterialGeometry as UnknownRecord).morphTargetDictionary = this.morphTargetDictionary;
      }

      if (
        this.morphTargetInfluences &&
        'morphTargetInfluences' in this._objectMaterialGeometry
      ) {
        (this
          ._objectMaterialGeometry as UnknownRecord).morphTargetInfluences = this.morphTargetInfluences;
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

  private getMaterial(): Material[] | Material | undefined {
    if (this.material) {
      if (
        (Array.isArray(this.material) &&
          this.material[0] instanceof Material) ||
        this.material instanceof Material
      ) {
        return this.material as Material | Material[];
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

  private getGeometry(): BufferGeometry | undefined {
    if (this.geometry) {
      if (this.geometry instanceof BufferGeometry) {
        return this.geometry;
      }

      return this.instancesStore.getImperativeState().bufferGeometries[
        this.geometry
      ];
    }
    return undefined;
  }
}
