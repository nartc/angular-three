import { ThreeObject3d } from '@angular-three/core';
import type { QueryList } from '@angular/core';
import { AfterContentInit, ContentChildren, Directive } from '@angular/core';
import { LOD } from 'three';
import { LodLevelDirective } from './lod-level.directive';

@Directive({
  selector: 'ngt-lod',
  exportAs: 'ngtLod',
  providers: [
    { provide: ThreeObject3d, useExisting: LodDirective },
  ],
})
export class LodDirective
  extends ThreeObject3d<LOD>
  implements AfterContentInit {
  private _lod!: LOD;

  @ContentChildren(LodLevelDirective) lodLevels?: QueryList<LodLevelDirective>;

  ngAfterContentInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.lodLevels) {
        this.init();
        this.lodLevels.forEach((lodLevel) => {
          if (lodLevel.hostObject) {
            this._lod.addLevel(lodLevel.hostObject, lodLevel.distance);
          }
        });
      }
    });
  }

  protected initObject() {
    this._lod = new LOD();
  }

  get object3d(): LOD {
    return this._lod;
  }
}
