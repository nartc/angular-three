import type { Camera, Intersection, Object3D, Ray, Vector3 } from 'three';

export interface ThreeIntersection extends Intersection {
  eventObject: Object3D;
}

export interface ThreeIntersectionEvent<TSourceEvent>
  extends ThreeIntersection {
  intersections: ThreeIntersection[];
  stopped: boolean;
  unprojectedPoint: Vector3;
  ray: Ray;
  camera: Camera;
  stopPropagation: () => void;
  /**
   * @deprecated use {@link nativeEvent}
   */
  sourceEvent: TSourceEvent;
  nativeEvent: TSourceEvent;
  delta: number;
}
