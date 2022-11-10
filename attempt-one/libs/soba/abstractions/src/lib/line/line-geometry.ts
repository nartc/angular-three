import {
  AnyConstructor,
  is,
  NgtCommonGeometry,
  NgtTriple,
  provideCommonGeometryRef,
  provideNgtCommonGeometry,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';
import { LineGeometry } from 'three-stdlib';

@Component({
  selector: 'ngt-soba-line-geometry',
  standalone: true,
  template: `
    <ng-content></ng-content>
  `,

  providers: [
    provideNgtCommonGeometry(NgtSobaLineGeometry),
    provideCommonGeometryRef(NgtSobaLineGeometry),
  ],
})
export class NgtSobaLineGeometry extends NgtCommonGeometry<LineGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof LineGeometry>
    | undefined;

  @Input() set points(points: Array<THREE.Vector3 | NgtTriple>) {
    this.set({ points });
  }

  @Input() set vertexColors(vertexColors: Array<THREE.Color | NgtTriple>) {
    this.set({ vertexColors });
  }

  override get geometryType(): AnyConstructor<LineGeometry> {
    return LineGeometry;
  }

  override initTrigger$ = this.select(
    this.select((s) => s['points']),
    this.select((s) => s['vertexColors'])
  );

  override postInit() {
    super.postInit();
    const { points, vertexColors } = this.get();

    const pointValues = (points as Array<THREE.Vector3 | NgtTriple>).map((p) =>
      is.vector3(p) ? p.toArray() : p
    );

    this.instanceValue.setPositions(pointValues.flat());

    if (vertexColors.length) {
      const colorValues = (vertexColors as Array<THREE.Color | NgtTriple>).map(
        (c) => (is.color(c) ? c.toArray() : c)
      );
      this.instanceValue.setColors(colorValues.flat());
    }
  }
}
