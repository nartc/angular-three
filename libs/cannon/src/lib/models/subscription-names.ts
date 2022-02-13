import { atomicNames } from './atomic';
import { vectorNames } from './vector';

export const subscriptionNames = [
    ...atomicNames,
    ...vectorNames,
    'quaternion',
    'sliding',
] as const;

export type SubscriptionName = typeof subscriptionNames[number];
