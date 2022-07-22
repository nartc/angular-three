import { provideCommonGeometryRef } from '@angular-three/core';
import { NgtBufferGeometry } from '@angular-three/core/geometries';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'sandbox-height-field-geometry[elementSize][heights]',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(HeightFieldGeometryComponent)],
})
export class HeightFieldGeometryComponent extends NgtBufferGeometry {
  @Input() elementSize = 0;
  @Input() set heights(heights: number[][]) {
    this.set({ heights });
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.effect(
          tap(() => {
            if (!this.instanceValue) return;
            const heights = this.get((s) => s['heights']) as number[][];

            const dx = this.elementSize;
            const dy = this.elementSize;

            /* Create the vertex data from the heights. */
            const vertices = heights.flatMap((row, i) => row.flatMap((z, j) => [i * dx, j * dy, z]));

            /* Create the faces. */
            const indices = [];
            for (let i = 0; i < heights.length - 1; i++) {
              for (let j = 0; j < heights[i].length - 1; j++) {
                const stride = heights[i].length;
                const index = i * stride + j;
                indices.push(index + 1, index + stride, index + stride + 1);
                indices.push(index + stride, index + 1, index);
              }
            }

            this.instanceValue.setIndex(indices);
            this.instanceValue.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            this.instanceValue.computeVertexNormals();
            this.instanceValue.computeBoundingBox();
            this.instanceValue.computeBoundingSphere();
          })
        )(
          this.select(
            this.instance$,
            this.select((s) => s['heights'])
          )
        );
      });
    });
  }
}
