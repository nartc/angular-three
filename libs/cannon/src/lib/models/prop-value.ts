import { NgtQuad, NgtTriplet } from '@angular-three/core';
import { AtomicName, AtomicProps } from './atomic';
import { SubscriptionName } from './subscription-names';
import { VectorName } from './vector';

export type PropValue<T extends SubscriptionName = SubscriptionName> =
    T extends AtomicName
        ? AtomicProps[T]
        : T extends VectorName
        ? NgtTriplet
        : T extends 'quaternion'
        ? NgtQuad
        : T extends 'sliding'
        ? boolean
        : never;
