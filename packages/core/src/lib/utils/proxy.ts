import { inject, NgZone } from '@angular/core';
import { isObservable, Subscription } from 'rxjs';
import { injectWrapper } from '../directives/wrapper';
import { injectInstance, injectInstanceRef, NGT_PROXY_INSTANCE, NgtInstance } from '../instance';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import { NgtAnyFunction, NgtAttachFunction, NgtStateFactory } from '../types';
import { applyProps } from './apply-props';
import { capitalize } from './capitalize';
import { prepare } from './instance';

export function proxify<T extends object>(
    instance: T,
    proxifyOptions: {
        attach?: string | string[] | NgtAttachFunction<T>;
        created?: (instance: T, stateFactory: NgtStateFactory, ngtInstance: NgtInstance) => void;
        updated?: (instance: T, stateFactory: NgtStateFactory, ngtInstance: NgtInstance) => void;
        primitive?: boolean;
    } = {}
): T {
    const ngtWrapper = injectWrapper({ host: true, optional: true });
    const ngtInstance = injectInstance<T>({ host: true });
    const store = inject(NgtStore);
    const zone = inject(NgZone);
    const parentInstance = injectInstanceRef({ skipSelf: true, optional: true });

    return zone.runOutsideAngular(() => {
        if (ngtWrapper) {
            return ngtWrapper;
        }

        // prep the instance w/ local state
        instance = prepare(
            instance,
            store.read,
            store.rootStateFactory,
            parentInstance?.(),
            ngtInstance.instanceValue ? ngtInstance.instanceRef : undefined,
            !!proxifyOptions.primitive
        );

        let storeReadySubscription: Subscription;
        const newValueSubscriptionMap = new Map<string, () => void>();

        function setProp(obj: T, prop: string, newValue: any): (() => void) | undefined {
            const capitalizedProp = `set${capitalize(prop)}` as keyof T;

            if (isObservable(newValue)) {
                const sub = newValue.subscribe((val) => {
                    if (obj[capitalizedProp] && typeof obj[capitalizedProp] === 'function') {
                        (obj[capitalizedProp] as NgtAnyFunction)(val);
                    } else {
                        applyProps(obj, { [prop]: val });
                    }

                    ngtInstance.write({ [prop]: val });
                });
                return () => sub.unsubscribe();
            }

            if (obj[capitalizedProp] && typeof obj[capitalizedProp] === 'function') {
                (obj[capitalizedProp] as NgtAnyFunction)(newValue);
            } else {
                applyProps(obj, { [prop]: newValue });
            }
            ngtInstance.write({ [prop]: newValue });
            return;
        }

        const handler: ProxyHandler<T> = {
            get(target: T, p: string | symbol, receiver: any): any {
                if (p === 'instanceRef') return ngtInstance.instanceRef;
                if (p === 'instance') return ngtInstance;
                if (p === NGT_PROXY_INSTANCE) return target;

                const capitalizedProp = `get${capitalize(p as string)}`;
                if (target[capitalizedProp as keyof T] && typeof target[capitalizedProp as keyof T] === 'function') {
                    return (target[capitalizedProp as keyof T] as Function)();
                }

                return Reflect.get(target, p, receiver);
            },
            set(target: T, p: string | symbol, newValue: any, receiver: any): boolean {
                const prop = p as string;

                if (storeReadySubscription) storeReadySubscription.unsubscribe();
                if (newValueSubscriptionMap.has(prop)) newValueSubscriptionMap.get(prop)!();

                // Angular sets this property
                if (p === '__ngContext__') return Reflect.set(target, p, newValue, receiver);

                return zone.runOutsideAngular(() => {
                    // TODO: figure out what else we need to handle
                    if (store.read((s) => s.ready)) {
                        const cleanUp = setProp(instance, prop, newValue);
                        if (cleanUp) newValueSubscriptionMap.set(prop, cleanUp);
                    } else {
                        storeReadySubscription = store.onReady(() => setProp(instance, prop, newValue));
                    }

                    // schedule updateCallback on next event loop
                    queueMicrotask(() => {
                        if (ngtInstance.updateCallback) ngtInstance.updateCallback(instance);
                        if (proxifyOptions.updated) proxifyOptions.updated(instance, store.read, ngtInstance);
                    });

                    return true;
                });
            },
        };

        ngtInstance.effect<void>(
            tapEffect(() => () => {
                if (storeReadySubscription) storeReadySubscription.unsubscribe();
                newValueSubscriptionMap.forEach((cleanUp) => cleanUp());
            })
        )();

        const proxied = new Proxy(instance, handler);

        if (proxifyOptions.attach) ngtInstance.attach = proxifyOptions.attach;
        if (proxifyOptions.created) proxifyOptions.created(proxied, store.read, ngtInstance);

        ngtInstance.instanceRef.set(proxied);

        return proxied;
    });
}
