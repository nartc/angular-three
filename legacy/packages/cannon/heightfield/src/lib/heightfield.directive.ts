//GENERATED
import {
  ArgFn,
  BodyShapeType,
  HeightfieldProps,
  GetByIndex,
  NgtPhysicBody,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: '[ngtPhysicHeightfield]',
  exportAs: 'ngtPhysicHeightfield',
  providers: [{ provide: NgtPhysicBody, useExisting: NgtPhysicHeightfield }],
})
export class NgtPhysicHeightfield extends NgtPhysicBody<HeightfieldProps> {
  static ngAcceptInputType_getPhysicProps: GetByIndex<HeightfieldProps> | undefined;

  protected get type(): BodyShapeType {
    return 'Heightfield';
  }

  protected get argsFn(): ArgFn<HeightfieldProps['args']> {
    return (args) => args;
  }
}
