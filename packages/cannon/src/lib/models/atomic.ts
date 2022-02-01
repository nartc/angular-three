import { MaterialOptions } from 'cannon-es';

export type AtomicProps = {
  allowSleep: boolean;
  angularDamping: number;
  collisionFilterGroup: number;
  collisionFilterMask: number;
  collisionResponse: number;
  fixedRotation: boolean;
  isTrigger: boolean;
  linearDamping: number;
  mass: number;
  material: MaterialOptions;
  sleepSpeedLimit: number;
  sleepTimeLimit: number;
  userData: {};
};

export const atomicNames = [
  'allowSleep',
  'angularDamping',
  'collisionFilterGroup',
  'collisionFilterMask',
  'collisionResponse',
  'fixedRotation',
  'isTrigger',
  'linearDamping',
  'mass',
  'material',
  'sleepSpeedLimit',
  'sleepTimeLimit',
  'userData',
] as const;

export type AtomicName = typeof atomicNames[number];
