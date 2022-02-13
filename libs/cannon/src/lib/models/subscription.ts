import { PropValue } from './prop-value';
import { SubscriptionName } from './subscription-names';

export type Subscription = Partial<{
    [K in SubscriptionName]: (value: PropValue<K>) => void;
}>;
export type Subscriptions = Partial<{
    [id: number]: Subscription;
}>;
