import { AtomicName } from './atomic';
import { PropValue } from './prop-value';

export type Observation = {
    [K in AtomicName]: [id: number, value: PropValue<K>, type: K];
}[AtomicName];
