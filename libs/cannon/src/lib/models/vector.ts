import { NgtTriplet } from '@angular-three/core';
import * as THREE from 'three';

export const vectorNames = [
    'angularFactor',
    'angularVelocity',
    'linearFactor',
    'position',
    'velocity',
] as const;

export type VectorName = typeof vectorNames[number];
export type VectorProps = Record<VectorName, NgtTriplet>;

export type VectorTypes = THREE.Vector3 | NgtTriplet;
