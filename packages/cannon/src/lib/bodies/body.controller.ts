// GENERATED
import {
  Controller,
  createControllerProviderFactory,
  NGT_OBJECT_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import {
  AfterContentInit,
  Directive,
  Input,
  NgModule,
  NgZone,
} from '@angular/core';
import { BodyProps } from '../models/body';
import { GetByIndex } from '../models/types';
import { NgtPhysicBodyStore } from './body.store';

@Directive({
  selector: `
    [ngtPhysicBox],
    [ngtPhysicPlane],
    [ngtPhysicCylinder],
    [ngtPhysicHeightfield],
    [ngtPhysicParticle],
    [ngtPhysicSphere],
    [ngtPhysicTrimesh],
    [ngtPhysicConvexPolyhedron],
    [ngtPhysicCompound]
  `,
  exportAs: 'ngtPhysicBody',
  providers: [NgtPhysicBodyStore],
})
export class NgtPhysicBodyController
  extends Controller
  implements AfterContentInit
{
  @Input() set getPhysicProps(fn: GetByIndex<BodyProps> | undefined) {
    this.physicBodyStore.updaters.setGetPhysicProps(fn);
  }

  constructor(private physicBodyStore: NgtPhysicBodyStore, ngZone: NgZone) {
    super(ngZone);
  }

  ngAfterContentInit() {
    this.ngZone.runOutsideAngular(() => {
      this.physicBodyStore.initEffect();
    });
  }

  get api() {
    return this.physicBodyStore.api;
  }

  get controller(): Controller | undefined {
    return undefined;
  }

  get props(): string[] {
    return [];
  }
}

@NgModule({
  declarations: [NgtPhysicBodyController],
  exports: [NgtPhysicBodyController],
})
export class NgtPhysicBodyControllerModule {}

export const [
  NGT_PHYSIC_BODY_WATCHED_CONTROLLER,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
] = createControllerProviderFactory({
  watchedControllerTokenName: 'Watched PhysicBodyController',
  controller: NgtPhysicBodyController,
});
