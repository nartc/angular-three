import {
  ArgFn,
  BodyShapeType,
  BoxProps,
  GetByIndex,
  NgtPhysicBody,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: '[ngtPhysicBox]',
  exportAs: 'ngtPhysicBox',
})
export class NgtPhysicBox extends NgtPhysicBody<BoxProps> {
  static ngAcceptInputType_getPropsByIndex: GetByIndex<BoxProps> | undefined;

  protected get type(): BodyShapeType {
    return 'Box';
  }

  protected get argsFn(): ArgFn<BoxProps['args']> {
    return (args = [1, 1, 1]) => args;
  }
}
