import { NgtQuad, NgtTriplet } from '@angular-three/core';
import * as THREE from 'three';
import { AtomicName, AtomicProps } from './atomic';
import { VectorName } from './vector';

export type AtomicApi<K extends AtomicName> = {
  set: (value: AtomicProps[K]) => void;
  subscribe: (callback: (value: AtomicProps[K]) => void) => () => void;
};

export type QuaternionApi = {
  set: (x: number, y: number, z: number, w: number) => void;
  copy: ({ w, x, y, z }: THREE.Quaternion) => void;
  subscribe: (callback: (value: NgtQuad) => void) => () => void;
};

export type VectorApi = {
  set: (x: number, y: number, z: number) => void;
  copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => void;
  subscribe: (callback: (value: NgtTriplet) => void) => () => void;
};

export type WorkerApi = {
  [K in AtomicName]: AtomicApi<K>;
} & {
  [K in VectorName]: VectorApi;
} & {
  applyForce: (force: NgtTriplet, worldPoint: NgtTriplet) => void;
  applyImpulse: (impulse: NgtTriplet, worldPoint: NgtTriplet) => void;
  applyLocalForce: (force: NgtTriplet, localPoint: NgtTriplet) => void;
  applyLocalImpulse: (impulse: NgtTriplet, localPoint: NgtTriplet) => void;
  applyTorque: (torque: NgtTriplet) => void;
  quaternion: QuaternionApi;
  rotation: VectorApi;
  sleep: () => void;
  wakeUp: () => void;
};

export interface PublicApi extends WorkerApi {
  at: (index: number) => WorkerApi;
}
