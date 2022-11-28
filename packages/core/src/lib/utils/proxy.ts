import { inject, NgZone } from '@angular/core';
import { isObservable, Subscription } from 'rxjs';
import { injectInstance, injectInstanceRef, NgtInstance, NGT_PROXY_INSTANCE } from '../instance';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import { NgtAnyFunction, NgtAnyRecord, NgtAttachFunction, NgtObservableInput, NgtStateFactory } from '../types';
import { applyProps } from './apply-props';
import { capitalize } from './capitalize';
import { prepare } from './instance';

const wrapperMap = new Map();

export function proxify<T extends object>(
    instance: T,
    proxifyOptions: {
        attach?: string | string[] | NgtAttachFunction<T>;
        created?: (instance: T, stateFactory: NgtStateFactory, ngtInstance: NgtInstance) => void;
        updated?: (instance: T, stateFactory: NgtStateFactory, ngtInstance: NgtInstance) => void;
        primitive?: boolean;
    } = {}
): T {
    const ngtInstance = injectInstance<T>({ host: true });
    const parentInstance = injectInstanceRef({ skipSelf: true, optional: true });

    const store = inject(NgtStore);
    const zone = inject(NgZone);

    return zone.runOutsideAngular(() => {
        // prep the instance w/ local state
        let storeReadySubscription: Subscription;
        let primitivePropsSubscription: Subscription;
        const newValueSubscriptionMap = new Map<string, () => void>();

        instance = prepare(
            instance,
            store.read,
            ngtInstance,
            parentInstance?.(),
            ngtInstance.instanceValue ? ngtInstance.instanceRef : undefined,
            !!proxifyOptions.primitive
        );

        ngtInstance.effect<void>(
            tapEffect(() => () => {
                if (storeReadySubscription) storeReadySubscription.unsubscribe();
                if (primitivePropsSubscription) primitivePropsSubscription.unsubscribe();
                newValueSubscriptionMap.forEach((cleanUp) => cleanUp());
            })
        )();

        function setProp(obj: T, prop: string, newValue: any): (() => void) | undefined {
            const setCapitalizedProp = `set${capitalize(prop)}` as keyof T;
            // const onCapitalizedProp = `on${capitalize(prop)}` as keyof T;

            if (isObservable(newValue)) {
                const sub = newValue.subscribe((val) => {
                    if (obj[setCapitalizedProp] && typeof obj[setCapitalizedProp] === 'function') {
                        (obj[setCapitalizedProp] as NgtAnyFunction)(val);
                    } else {
                        applyProps(obj, { [prop]: val });
                    }

                    // if (obj[onCapitalizedProp] && typeof obj[onCapitalizedProp] === 'function') {
                    //     (obj[onCapitalizedProp] as NgtAnyFunction)(val, ngtInstance, store.read);
                    // }
                    ngtInstance.write({ [prop]: val });
                });
                return () => sub.unsubscribe();
            }

            if (obj[setCapitalizedProp] && typeof obj[setCapitalizedProp] === 'function') {
                (obj[setCapitalizedProp] as NgtAnyFunction)(newValue);
            } else {
                applyProps(obj, { [prop]: newValue });
            }
            // if (obj[onCapitalizedProp] && typeof obj[onCapitalizedProp] === 'function') {
            //     (obj[onCapitalizedProp] as NgtAnyFunction)(newValue, ngtInstance, store.read);
            // }
            ngtInstance.write({ [prop]: newValue });
            return;
        }

        const handler: ProxyHandler<T> = {
            get(target: T, p: string | symbol, receiver: any): any {
                if (p === 'instanceRef')
                    return (
                        wrapperMap.get(target)?.wrappedInstance?.instanceRef ||
                        wrapperMap.get(receiver)?.wrappedInstance?.instanceRef ||
                        ngtInstance.instanceRef
                    );
                if (p === 'instance')
                    return (
                        wrapperMap.get(target)?.wrappedInstance ||
                        wrapperMap.get(receiver)?.wrappedInstance ||
                        ngtInstance
                    );
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

                // these are injected. the component might use this
                if (newValue === zone || newValue === ngtInstance || newValue === store) {
                    return Reflect.set(target, p, newValue, receiver);
                }

                // let's not assign props on primitive
                if ((p as string) === 'props' && proxifyOptions.primitive) {
                    if (primitivePropsSubscription) {
                        primitivePropsSubscription.unsubscribe();
                    }
                    const props = newValue as NgtObservableInput<NgtAnyRecord>;
                    if (isObservable(props)) {
                        primitivePropsSubscription = props.subscribe((properties) => {
                            applyProps(instance, properties as NgtAnyRecord);
                        });
                    } else {
                        applyProps(instance, props);
                    }

                    return true;
                }

                // observables in the components
                if ((p as string).endsWith('$')) return Reflect.set(target, p, newValue, receiver);
                // class members that need to bypass applyProps
                if ((p as string).endsWith('__') && (p as string).startsWith('__'))
                    return Reflect.set(target, p, newValue, receiver);

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
            },
        };

        const proxied = new Proxy(instance, handler);

        if (proxifyOptions.attach) ngtInstance.attach = proxifyOptions.attach;
        if (proxifyOptions.created) proxifyOptions.created(proxied, store.read, ngtInstance);

        ngtInstance.instanceRef.set(proxied);

        return proxied;
    });
}
