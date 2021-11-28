import * as THREE from 'packages/core/src/lib/models/three';

export interface NgtIntersection extends THREE.Intersection {
  eventObject: THREE.Object3D;
}

export interface NgtIntersectionEvent<TSourceEvent> extends NgtIntersection {
  intersections: NgtIntersection[];
  stopped: boolean;
  unprojectedPoint: THREE.Vector3;
  ray: THREE.Ray;
  camera: THREE.Camera;
  stopPropagation: () => void;
  /**
   * @deprecated use {@link nativeEvent}
   */
  sourceEvent: TSourceEvent;
  nativeEvent: TSourceEvent;
  delta: number;
}

export interface NgtPointerCaptureTarget {
  intersection: NgtIntersection;
  target: Element;
}
