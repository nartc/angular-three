//GENERATED
import {
  ArgFn,
  BodyShapeType,
  CompoundBodyProps,
  GetByIndex,
  NgtPhysicBody,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: '[ngtPhysicCompound]',
  exportAs: 'ngtPhysicCompound',
  providers: [{ provide: NgtPhysicBody, useExisting: NgtPhysicCompound }],
})
export class NgtPhysicCompound extends NgtPhysicBody<CompoundBodyProps> {
  static ngAcceptInputType_getPhysicProps: GetByIndex<CompoundBodyProps> | undefined;

  protected get type(): BodyShapeType {
    return 'Compound';
  }

  protected get argsFn(): ArgFn<CompoundBodyProps['args']> {
    return (args) => args as unknown[];
  }
}
