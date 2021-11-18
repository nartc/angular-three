//GENERATED
import {
  ArgFn,
  BodyShapeType,
  CylinderProps,
  GetByIndex,
  NgtPhysicBody,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: '[ngtPhysicCylinder]',
  exportAs: 'ngtPhysicCylinder',
  providers: [{ provide: NgtPhysicBody, useExisting: NgtPhysicCylinder }],
})
export class NgtPhysicCylinder extends NgtPhysicBody<CylinderProps> {
  static ngAcceptInputType_getPropsByIndex:
    | GetByIndex<CylinderProps>
    | undefined;

  protected get type(): BodyShapeType {
    return 'Cylinder';
  }

  protected get argsFn(): ArgFn<CylinderProps['args']> {
    return (args = []) => args;
  }
}
