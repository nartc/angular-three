import {
  ArgFn,
  BodyShapeType,
  TrimeshProps,
  GetByIndex,
  NgtPhysicBody,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: '[ngtPhysicTrimesh]',
  exportAs: 'ngtPhysicTrimesh',
  providers: [{ provide: NgtPhysicBody, useExisting: NgtPhysicTrimesh }],
})
export class NgtPhysicTrimesh extends NgtPhysicBody<TrimeshProps> {
  static ngAcceptInputType_getPropsByIndex:
    | GetByIndex<TrimeshProps>
    | undefined;

  protected get type(): BodyShapeType {
    return 'Trimesh';
  }

  protected get argsFn(): ArgFn<TrimeshProps['args']> {
    return (args) => args;
  }
}
