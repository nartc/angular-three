import { NgtTriplet } from '@angular-three/core';

export interface SpringOpts {
  restLength?: number;
  stiffness?: number;
  damping?: number;
  worldAnchorA?: NgtTriplet;
  worldAnchorB?: NgtTriplet;
  localAnchorA?: NgtTriplet;
  localAnchorB?: NgtTriplet;
}
