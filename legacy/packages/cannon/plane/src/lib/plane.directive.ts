//GENERATED
import {
  ArgFn,
  BodyShapeType,
  PlaneProps,
  GetByIndex,
  NgtPhysicBody,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: '[ngtPhysicPlane]',
  exportAs: 'ngtPhysicPlane',
  providers: [{ provide: NgtPhysicBody, useExisting: NgtPhysicPlane }],
})
export class NgtPhysicPlane extends NgtPhysicBody<PlaneProps> {
  static ngAcceptInputType_getPhysicProps: GetByIndex<PlaneProps> | undefined;

  protected get type(): BodyShapeType {
    return 'Plane';
  }

  protected get argsFn(): ArgFn<PlaneProps['args']> {
    return () => [];
  }
}
