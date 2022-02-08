import { NgtQuad, NgtTriplet } from '@angular-three/core';
import { RayOptions } from 'cannon-es';
import { AtomicName } from './atomic';
import { BodyShapeType } from './body';
import { Buffers } from './buffers';
import { ConstraintTypes } from './constraints';
import {
  WorkerCollideBeginEvent,
  WorkerCollideEndEvent,
  WorkerCollideEvent,
  WorkerRayhitEvent,
} from './events';
import { Observation } from './observation';
import { NgtPhysicsState } from './physics-state';
import { SpringOpts } from './spring-opts';
import { SubscriptionName } from './subscription-names';
import { SetOpName } from './types';
import { VectorName } from './vector';
import { WheelInfoOptions } from './wheel-info-opts';

export type WorkerFrameMessage = {
  data: Buffers & {
    op: 'frame';
    observations: Observation[];
    active: boolean;
    bodies?: string[];
  };
};

export type WorkerEventMessage =
  | WorkerCollideEvent
  | WorkerRayhitEvent
  | WorkerCollideBeginEvent
  | WorkerCollideEndEvent;

export type IncomingWorkerMessage = WorkerFrameMessage | WorkerEventMessage;

type Operation<T extends string, P> = { op: T } & (P extends void
  ? {}
  : { props: P });
type WithUUID<T extends string, P = void> = Operation<T, P> & { uuid: string };
type WithUUIDs<T extends string, P = void> = Operation<T, P> & {
  uuid: string[];
};

type AddConstraintMessage = WithUUID<
  'addConstraint',
  [uuidA: string, uuidB: string, options: {}]
> & {
  type: 'Hinge' | ConstraintTypes;
};

type DisableConstraintMessage = WithUUID<'disableConstraint'>;
type EnableConstraintMessage = WithUUID<'enableConstraint'>;
type RemoveConstraintMessage = WithUUID<'removeConstraint'>;

type ConstraintMessage =
  | AddConstraintMessage
  | DisableConstraintMessage
  | EnableConstraintMessage
  | RemoveConstraintMessage;

type DisableConstraintMotorMessage = WithUUID<'disableConstraintMotor'>;
type EnableConstraintMotorMessage = WithUUID<'enableConstraintMotor'>;
type SetConstraintMotorMaxForce = WithUUID<
  'setConstraintMotorMaxForce',
  number
>;
type SetConstraintMotorSpeed = WithUUID<'setConstraintMotorSpeed', number>;

type ConstraintMotorMessage =
  | DisableConstraintMotorMessage
  | EnableConstraintMotorMessage
  | SetConstraintMotorSpeed
  | SetConstraintMotorMaxForce;

type AddSpringMessage = WithUUID<
  'addSpring',
  [uuidA: string, uuidB: string, options: SpringOpts]
>;
type RemoveSpringMessage = WithUUID<'removeSpring'>;

type SetSpringDampingMessage = WithUUID<'setSpringDamping', number>;
type SetSpringRestLengthMessage = WithUUID<'setSpringRestLength', number>;
type SetSpringStiffnessMessage = WithUUID<'setSpringStiffness', number>;

type SpringMessage =
  | AddSpringMessage
  | RemoveSpringMessage
  | SetSpringDampingMessage
  | SetSpringRestLengthMessage
  | SetSpringStiffnessMessage;

export type RayMode = 'Closest' | 'Any' | 'All';

export type AddRayMessage = WithUUID<
  'addRay',
  {
    from?: NgtTriplet;
    mode: RayMode;
    to?: NgtTriplet;
  } & Pick<
    RayOptions,
    | 'checkCollisionResponse'
    | 'collisionFilterGroup'
    | 'collisionFilterMask'
    | 'skipBackfaces'
  >
>;
type RemoveRayMessage = WithUUID<'removeRay'>;

type RayMessage = AddRayMessage | RemoveRayMessage;

type AddRaycastVehicleMessage = WithUUIDs<
  'addRaycastVehicle',
  [
    chassisBodyUUID: string,
    wheelsUUID: string[],
    wheelInfos: WheelInfoOptions[],
    indexForwardAxis: number,
    indexRightAxis: number,
    indexUpAxis: number
  ]
>;
type RemoveRaycastVehicleMessage = WithUUIDs<'removeRaycastVehicle'>;

type ApplyRaycastVehicleEngineForceMessage = WithUUID<
  'applyRaycastVehicleEngineForce',
  [value: number, wheelIndex: number]
>;
type SetRaycastVehicleBrakeMessage = WithUUID<
  'setRaycastVehicleBrake',
  [brake: number, wheelIndex: number]
>;
type SetRaycastVehicleSteeringValueMessage = WithUUID<
  'setRaycastVehicleSteeringValue',
  [value: number, wheelIndex: number]
>;

type RaycastVehicleMessage =
  | AddRaycastVehicleMessage
  | ApplyRaycastVehicleEngineForceMessage
  | RemoveRaycastVehicleMessage
  | SetRaycastVehicleBrakeMessage
  | SetRaycastVehicleSteeringValueMessage;

type AtomicMessage = WithUUID<SetOpName<AtomicName>, any>;
type QuaternionMessage = WithUUID<SetOpName<'quaternion'>, NgtQuad>;
type RotationMessage = WithUUID<SetOpName<'rotation'>, NgtTriplet>;
type VectorMessage = WithUUID<SetOpName<VectorName>, NgtTriplet>;

type ApplyForceMessage = WithUUID<
  'applyForce',
  [force: NgtTriplet, worldPoint: NgtTriplet]
>;
type ApplyImpulseMessage = WithUUID<
  'applyImpulse',
  [impulse: NgtTriplet, worldPoint: NgtTriplet]
>;
type ApplyLocalForceMessage = WithUUID<
  'applyLocalForce',
  [force: NgtTriplet, localPoint: NgtTriplet]
>;
type ApplyLocalImpulseMessage = WithUUID<
  'applyLocalImpulse',
  [impulse: NgtTriplet, localPoint: NgtTriplet]
>;
type ApplyTorque = WithUUID<'applyTorque', [torque: NgtTriplet]>;

type ApplyMessage =
  | ApplyForceMessage
  | ApplyImpulseMessage
  | ApplyLocalForceMessage
  | ApplyLocalImpulseMessage
  | ApplyTorque;

type SerializableBodyProps = {
  onCollide: boolean;
};

type AddBodiesMessage = WithUUIDs<'addBodies', SerializableBodyProps[]> & {
  type: BodyShapeType;
};
type RemoveBodiesMessage = WithUUIDs<'removeBodies'>;

type BodiesMessage = AddBodiesMessage | RemoveBodiesMessage;

type SleepMessage = WithUUID<'sleep'>;
type WakeUpMessage = WithUUID<'wakeUp'>;

export type SubscriptionTarget = 'bodies' | 'vehicles';

type SubscribeMessage = WithUUID<
  'subscribe',
  {
    id: number;
    target: SubscriptionTarget;
    type: SubscriptionName;
  }
>;
type UnsubscribeMessage = Operation<'unsubscribe', number>;

type SubscriptionMessage = SubscribeMessage | UnsubscribeMessage;

export type WorldPropName =
  | 'axisIndex'
  | 'broadphase'
  | 'gravity'
  | 'iterations'
  | 'step'
  | 'tolerance';

type WorldMessage<T extends WorldPropName> = Operation<
  SetOpName<T>,
  Required<NgtPhysicsState[T]>
>;

type CannonMessage =
  | ApplyMessage
  | AtomicMessage
  | BodiesMessage
  | ConstraintMessage
  | ConstraintMotorMessage
  | QuaternionMessage
  | RaycastVehicleMessage
  | RayMessage
  | RotationMessage
  | SleepMessage
  | SpringMessage
  | SubscriptionMessage
  | VectorMessage
  | WakeUpMessage
  | WorldMessage<WorldPropName>;

export interface CannonWorker extends Worker {
  postMessage: (message: CannonMessage) => void;
}
