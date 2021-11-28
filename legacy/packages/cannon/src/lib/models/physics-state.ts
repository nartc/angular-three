import { NgtTriplet } from '@angular-three/core';
import { Broadphase } from './broadphase';
import { Buffers } from './buffers';
import { DefaultContactMaterial } from './default-contact-material';
import { CannonEvents } from './events';
import { Refs } from './refs';
import { Solver } from './solver';
import { Subscriptions } from './subscription';

/**
 const bodies = useRef<{ [uuid: string]: number }>({})
 */
export interface PhysicsStoreState {
  worker: Worker;
  refs: Refs;
  buffers: Buffers;
  events: CannonEvents;
  subscriptions: Subscriptions;
  bodies: Record<string, number>;

  shouldInvalidate?: boolean;
  tolerance?: number;
  step?: number;
  iterations?: number;
  allowSleep?: boolean;
  broadphase?: Broadphase;
  gravity?: NgtTriplet;
  quatNormalizeFast?: boolean;
  quatNormalizeSkip?: number;
  solver?: Solver;
  axisIndex?: number;
  defaultContactMaterial?: DefaultContactMaterial;
  size?: number;
}
