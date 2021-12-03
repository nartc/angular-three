import { UnknownRecord } from './common';
import { NgtColor, NgtEuler, NgtQuaternion, NgtVector3 } from './three';

export interface NgtObject3dProps {
  name?: string;
  position?: NgtVector3;
  rotation?: NgtEuler;
  quaternion?: NgtQuaternion;
  scale?: NgtVector3;
  color?: NgtColor;
  userData?: UnknownRecord;
  dispose?: (() => void) | null;
  castShadow?: boolean;
  receiveShadow?: boolean;
  visible?: boolean;
  matrixAutoUpdate?: boolean;
}
