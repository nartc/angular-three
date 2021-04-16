import { ThreeObject3d } from '@angular-three/core';
import { ThreeBufferGeometry } from '@angular-three/core/geometries';
import { ThreeMaterial } from '@angular-three/core/materials';
import { ContentChild, Directive, Input } from '@angular/core';
import { BufferGeometry, Material, Mesh } from 'three';

@Directive()
export abstract class ThreeMesh<
  TMesh extends Mesh = Mesh,
  TMeshConstructor extends typeof Mesh = typeof Mesh
> extends ThreeObject3d<TMesh> {
  @Input() geometry?: string | BufferGeometry | null;
  @Input() material?: string | Material | null;

  @ContentChild(ThreeMaterial) materialDirective?: ThreeMaterial;
  @ContentChild(ThreeBufferGeometry)
  bufferGeometryDirective?: ThreeBufferGeometry;

  abstract meshType: new (...args: any[]) => TMesh;

  private _mesh!: TMesh;
  private _extraArgs?: unknown[];
  set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  protected initObject() {
    if (this.canCreate()) {
      let geometry: BufferGeometry | undefined = this.bufferGeometryDirective
        ?.bufferGeometry;
      let material: Material | undefined = this.materialDirective?.material;

      if (this.geometry) {
        if (this.geometry instanceof BufferGeometry) {
          geometry = this.geometry;
        } else {
          geometry = this.instancesStore.getImperativeState().bufferGeometries[
            this.geometry
          ];
        }
      }

      if (this.material) {
        if (this.material instanceof Material) {
          material = this.material;
        } else {
          material = this.instancesStore.getImperativeState().materials[
            this.material
          ];
        }
      }

      this._mesh = new ((this.meshType as unknown) as new (
        ...args: unknown[]
      ) => TMesh)(geometry, material, ...(this._extraArgs || [])) as TMesh;

      if (this.customize) {
        this.customize();
      }
    }
  }

  protected customize?: () => void;

  protected canCreate() {
    return true;
  }

  get object3d(): TMesh {
    return this._mesh;
  }
}
