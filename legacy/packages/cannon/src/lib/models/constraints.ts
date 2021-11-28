import { NgtTriplet } from '@angular-three/core';
import * as THREE from 'three';

export type ConstraintTypes =
  | 'PointToPoint'
  | 'ConeTwist'
  | 'Distance'
  | 'Lock';

export type ConstraintApi = [
  THREE.Object3D,
  THREE.Object3D,
  {
    enable: () => void;
    disable: () => void;
  }
];

export type HingeConstraintApi = [
  THREE.Object3D,
  THREE.Object3D,
  {
    enable: () => void;
    disable: () => void;
    enableMotor: () => void;
    disableMotor: () => void;
    setMotorSpeed: (value: number) => void;
    setMotorMaxForce: (value: number) => void;
  }
];

export type SpringApi = [
  THREE.Object3D,
  THREE.Object3D,
  {
    setStiffness: (value: number) => void;
    setRestLength: (value: number) => void;
    setDamping: (value: number) => void;
  }
];

export type ConstraintORHingeApi<T extends 'Hinge' | ConstraintTypes> =
  T extends ConstraintTypes ? ConstraintApi : HingeConstraintApi;

export interface ConstraintOptns {
  maxForce?: number;
  collideConnected?: boolean;
  wakeUpBodies?: boolean;
}

export interface PointToPointConstraintOpts extends ConstraintOptns {
  pivotA: NgtTriplet;
  pivotB: NgtTriplet;
}

export interface ConeTwistConstraintOpts extends ConstraintOptns {
  pivotA?: NgtTriplet;
  axisA?: NgtTriplet;
  pivotB?: NgtTriplet;
  axisB?: NgtTriplet;
  angle?: number;
  twistAngle?: number;
}

export interface DistanceConstraintOpts extends ConstraintOptns {
  distance?: number;
}

export interface HingeConstraintOpts extends ConstraintOptns {
  pivotA?: NgtTriplet;
  axisA?: NgtTriplet;
  pivotB?: NgtTriplet;
  axisB?: NgtTriplet;
}

export type LockConstraintOpts = ConstraintOptns;

export interface SpringOptns {
  restLength?: number;
  stiffness?: number;
  damping?: number;
  worldAnchorA?: NgtTriplet;
  worldAnchorB?: NgtTriplet;
  localAnchorA?: NgtTriplet;
  localAnchorB?: NgtTriplet;
}
