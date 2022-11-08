import {
  AnyConstructor,
  NgtCommonGeometry,
  provideCommonGeometryRef,
  provideNgtCommonGeometry,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextGeometry } from 'three-stdlib';

@Component({
  selector: 'ngt-soba-text-geometry',
  standalone: true,
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonGeometry(NgtSobaTextGeometry),
    provideCommonGeometryRef(NgtSobaTextGeometry),
  ],
})
export class NgtSobaTextGeometry extends NgtCommonGeometry<TextGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof TextGeometry>
    | undefined;

  override get geometryType(): AnyConstructor<TextGeometry> {
    return TextGeometry;
  }
}
