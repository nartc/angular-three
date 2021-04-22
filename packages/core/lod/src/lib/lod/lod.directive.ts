import { ThreeObject3d } from '@angular-three/core';
import type { OnInit } from '@angular/core';
import { Directive } from '@angular/core';
import { LOD } from 'three';

@Directive({
  selector: 'ngt-lod',
  exportAs: 'ngtLod',
  providers: [{ provide: ThreeObject3d, useExisting: LodDirective }],
})
export class LodDirective extends ThreeObject3d<LOD> implements OnInit {
  private _lod!: LOD;

  ngOnInit() {
    this.init();
  }

  protected initObject() {
    this._lod = new LOD();
  }

  get object3d(): LOD {
    return this._lod;
  }
}
