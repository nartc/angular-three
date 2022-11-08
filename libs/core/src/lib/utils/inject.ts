import { inject, InjectionToken, InjectOptions, Provider } from '@angular/core';
import { NgtRef } from '../ref';
import type { AnyCtor, AnyFunction } from '../types';
import { is } from './is';

export function createNgtProvider(base: AnyCtor, ...providers: AnyFunction[]) {
  return (sub: AnyCtor) => {
    return [
      ...(providers || []).map((providerFn) => providerFn(sub)),
      {
        provide: base,
        useExisting: sub,
      },
    ];
  };
}

export function createInjection<
  TTokenValue,
  TProvideValue = TTokenValue extends object
    ? Partial<TTokenValue>
    : TTokenValue
>(
  description: string,
  {
    defaultValueOrFactory,
    provideValueFactory,
  }: {
    defaultValueOrFactory?: TTokenValue | (() => TTokenValue);
    provideValueFactory?: (value: TProvideValue) => TTokenValue;
  } = {}
): [
  injectFn: (options?: InjectOptions) => TTokenValue,
  provideFn: (value: TProvideValue) => Provider,
  token: InjectionToken<TTokenValue>
] {
  const factory = (
    defaultValueOrFactory && typeof defaultValueOrFactory === 'function'
      ? defaultValueOrFactory
      : () => defaultValueOrFactory
  ) as () => TTokenValue;
  const injectionToken = new InjectionToken(description, { factory });

  function injectFn(options: InjectOptions = {}) {
    return inject(injectionToken, options) as TTokenValue;
  }

  function provideFn(value: TProvideValue): Provider {
    return {
      provide: injectionToken,
      useValue: provideValueFactory ? provideValueFactory(value) : value,
    };
  }

  return [injectFn, provideFn, injectionToken];
}

export function createRefInjection<
  TInstanceType extends object = any,
  TCtor extends AnyCtor<TInstanceType> = AnyCtor<TInstanceType>
>(
  description: string,
  hostOrProviderFactory?: AnyFunction<Provider> | true,
  ...providersFactory: AnyFunction<Provider>[]
): [
  injectFn: (options?: InjectOptions) => AnyFunction<NgtRef<TInstanceType>>,
  providedFn: <TProvideCtor extends TCtor = TCtor>(
    sub: TProvideCtor,
    factory?: (instance: InstanceType<TProvideCtor>) => NgtRef
  ) => Provider,
  token: InjectionToken<AnyFunction<NgtRef<TInstanceType>>>
] {
  if (is.fun(hostOrProviderFactory)) {
    providersFactory = [hostOrProviderFactory, ...providersFactory];
  }

  const injectionToken = new InjectionToken(description);

  function injectFn(options: InjectOptions = {}) {
    return inject(injectionToken, options) as AnyFunction<NgtRef>;
  }

  function providerFn<TProvideCtor extends TCtor = TCtor>(
    sub: TProvideCtor,
    factory?: (instance: InstanceType<TProvideCtor>) => NgtRef
  ) {
    return [
      ...(providersFactory || []).map((providerFn) => providerFn(sub, factory)),
      {
        provide: injectionToken,
        useFactory: (instance: InstanceType<TProvideCtor>) => {
          if (factory) {
            return () => factory(instance);
          }

          if (is.boo(hostOrProviderFactory)) {
            return (instance as any)['parentRef'];
          }

          return () => (instance as any)['instance'];
        },
        deps: [sub],
      },
    ];
  }

  return [injectFn, providerFn, injectionToken];
}
