import { ThreeObject3d } from '@angular-three/core';
import type { OnInit, QueryList } from '@angular/core';
import { AfterContentInit, ContentChildren, Directive } from '@angular/core';
import { LOD } from 'three';

@Directive({
  selector: 'ngt-lod',
  exportAs: 'ngtLod',
  providers: [{ provide: ThreeObject3d, useExisting: LodDirective }],
})
export class LodDirective
  extends ThreeObject3d<LOD>
  implements OnInit, AfterContentInit {
  private _lod!: LOD;

  @ContentChildren(ThreeObject3d) objectLevels?: QueryList<ThreeObject3d>;

  ngOnInit() {
    this.init();
  }

  ngAfterContentInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.objectLevels) {
        this.objectLevels.forEach((objectLevel) => {
          if (objectLevel.object3d) {
            this._lod.addLevel(objectLevel.object3d, objectLevel.lodDistance);
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
