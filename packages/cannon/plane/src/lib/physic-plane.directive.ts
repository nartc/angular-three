import {
  ArgFn,
  BodyShapeType,
  GetByIndex,
  NgtPhysicBody,
  PlaneProps,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: '[ngtPhysicPlane]',
  exportAs: 'ngtPhysicPlane',
})
export class NgtPhysicPlane extends NgtPhysicBody<PlaneProps> {
  static ngAcceptInputType_getPropsByIndex: GetByIndex<PlaneProps> | undefined;

  protected get type(): BodyShapeType {
    return 'Plane';
  }

  protected get argsFn(): ArgFn<PlaneProps['args']> {
    return () => [];
  }
}
