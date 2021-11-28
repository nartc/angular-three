//GENERATED
import {
  ArgFn,
  BodyShapeType,
  SphereProps,
  GetByIndex,
  NgtPhysicBody,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: '[ngtPhysicSphere]',
  exportAs: 'ngtPhysicSphere',
  providers: [{ provide: NgtPhysicBody, useExisting: NgtPhysicSphere }],
})
export class NgtPhysicSphere extends NgtPhysicBody<SphereProps> {
  static ngAcceptInputType_getPhysicProps: GetByIndex<SphereProps> | undefined;

  protected get type(): BodyShapeType {
    return 'Sphere';
  }

  protected get argsFn(): ArgFn<SphereProps['args']> {
    return (args = [1]) => {
  if (!Array.isArray(args)) throw new Error("useSphere args must be an array");
  return [args[0]];
};
  }
}
