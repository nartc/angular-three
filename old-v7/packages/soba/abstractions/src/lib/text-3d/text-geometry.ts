import {
  NgtAnyConstructor,
  NgtCommonGeometry,
  provideCommonGeometryRef,
  provideNgtCommonGeometry,
} from '@angular-three/core';
import { Component } from '@angular/core';
import { TextGeometry } from 'three-stdlib';

@Component({
  selector: 'ngt-soba-text-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtSobaTextGeometry), provideCommonGeometryRef(NgtSobaTextGeometry)],
})
export class NgtSobaTextGeometry extends NgtCommonGeometry<TextGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof TextGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<TextGeometry> {
    return TextGeometry;
  }
}
