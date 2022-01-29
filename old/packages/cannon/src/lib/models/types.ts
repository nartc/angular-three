import { AtomicName } from './atomic';
import { BodyProps } from './body';
import { VectorName } from './vector';
import { WorldPropName } from './world-prop-names';

export type GetByIndex<T extends BodyProps> = (index: number) => T;
export type ArgFn<T> = (args: T) => unknown[];

export type SetOpName<
  T extends AtomicName | VectorName | WorldPropName | 'quaternion' | 'rotation'
> = `set${Capitalize<T>}`;
