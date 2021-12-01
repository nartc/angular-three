// GENERATED
import {
  Controller,
  createControllerProviderFactory,
  NGT_OBJECT_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input, NgModule, NgZone } from '@angular/core';
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
  providers: [NgtPhysicBodyStore, NGT_OBJECT_CONTROLLER_PROVIDER],
})
export class NgtPhysicBodyController extends Controller {
  @Input() set getPhysicProps(fn: GetByIndex<BodyProps> | undefined) {
    this.physicBodyStore.updaters.setGetPhysicProps(fn);
  }

  constructor(private physicBodyStore: NgtPhysicBodyStore, ngZone: NgZone) {
    super(ngZone);
  }

  ngOnInit() {
    super.ngOnInit();
    this.physicBodyStore.initEffect();
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
