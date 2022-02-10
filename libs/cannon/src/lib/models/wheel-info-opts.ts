import { NgtTriplet } from '@angular-three/core';

export interface WheelInfoOptions {
    radius?: number;
    directionLocal?: NgtTriplet;
    suspensionStiffness?: number;
    suspensionRestLength?: number;
    maxSuspensionForce?: number;
    maxSuspensionTravel?: number;
    dampingRelaxation?: number;
    dampingCompression?: number;
    sideAcceleration?: number;
    frictionSlip?: number;
    rollInfluence?: number;
    axleLocal?: NgtTriplet;
    chassisConnectionPointLocal?: NgtTriplet;
    isFrontWheel?: boolean;
    useCustomSlidingRotationalSpeed?: boolean;
    customSlidingRotationalSpeed?: number;
}
