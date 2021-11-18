//GENERATED
import {
  ArgFn,
  BodyShapeType,
  ConvexPolyhedronProps,
  GetByIndex,
  NgtPhysicBody,
  makeTriplet,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: '[ngtPhysicConvexPolyhedron]',
  exportAs: 'ngtPhysicConvexPolyhedron',
  providers: [{ provide: NgtPhysicBody, useExisting: NgtPhysicConvexPolyhedron }],
})
export class NgtPhysicConvexPolyhedron extends NgtPhysicBody<ConvexPolyhedronProps> {
  static ngAcceptInputType_getPhysicProps: GetByIndex<ConvexPolyhedronProps> | undefined;

  protected get type(): BodyShapeType {
    return 'ConvexPolyhedron';
  }

  protected get argsFn(): ArgFn<ConvexPolyhedronProps['args']> {
    return (args = []) => {
  return [
    args[0] ? args[0].map(makeTriplet) : undefined,
    args[1],
    args[2] ? args[2].map(makeTriplet) : undefined,
    args[3] ? args[3].map(makeTriplet) : undefined,
    args[4],
  ];
};
  }
}
