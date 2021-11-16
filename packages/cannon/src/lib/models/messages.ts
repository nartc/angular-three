import { Buffers } from './buffers';
import {
  WorkerCollideBeginEvent,
  WorkerCollideEndEvent,
  WorkerCollideEvent,
  WorkerRayhitEvent,
} from './events';
import { Observation } from './observation';

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
