import { NgtQuad, NgtTriplet } from '@angular-three/core';
import { AtomicProps } from './atomic';
import { CollideBeginEvent, CollideEndEvent, CollideEvent } from './events';
import { VectorProps, VectorTypes } from './vector';

export type BodyProps<T extends any[] = unknown[]> = Partial<AtomicProps> &
  Partial<VectorProps> & {
    args?: T;
    onCollide?: (e: CollideEvent) => void;
    onCollideBegin?: (e: CollideBeginEvent) => void;
    onCollideEnd?: (e: CollideEndEvent) => void;
    quaternion?: NgtQuad;
    rotation?: NgtTriplet;
    type?: 'Dynamic' | 'Static' | 'Kinematic';
  };
export type BodyPropsArgsRequired<T extends any[] = unknown[]> =
  BodyProps<T> & {
    args: T;
  };

export type ShapeType =
  | 'Plane'
  | 'Box'
  | 'Cylinder'
  | 'Heightfield'
  | 'Particle'
  | 'Sphere'
  | 'Trimesh'
  | 'ConvexPolyhedron';
export type BodyShapeType = ShapeType | 'Compound';

export type CylinderArgs = [
  radiusTop?: number,
  radiusBottom?: number,
  height?: number,
  numSegments?: number
];
export type SphereArgs = [radius: number];
export type TrimeshArgs = [
  vertices: ArrayLike<number>,
  indices: ArrayLike<number>
];
export type HeightfieldArgs = [
  data: number[][],
  options: { elementSize?: number; maxValue?: number; minValue?: number }
];
export type ConvexPolyhedronArgs<V extends VectorTypes = VectorTypes> = [
  vertices?: V[],
  faces?: number[][],
  normals?: V[],
  axes?: V[],
  boundingSphereRadius?: number
];

export type PlaneProps = BodyProps;
export type BoxProps = BodyProps<NgtTriplet>;
export type CylinderProps = BodyProps<CylinderArgs>;
export type ParticleProps = BodyProps;
export type SphereProps = BodyProps<SphereArgs>;
export type TrimeshProps = BodyPropsArgsRequired<TrimeshArgs>;
export type HeightfieldProps = BodyPropsArgsRequired<HeightfieldArgs>;
export type ConvexPolyhedronProps = BodyProps<ConvexPolyhedronArgs>;

export interface CompoundBodyProps extends BodyProps {
  shapes: BodyProps & { type: ShapeType }[];
}
