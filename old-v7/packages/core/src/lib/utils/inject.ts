import { inject, InjectionToken, InjectOptions, Provider } from '@angular/core';
import { NgtRef } from '../ref';
import type { NgtAnyCtor, NgtAnyFunction } from '../types';

export function createNgtProvider(base: NgtAnyCtor, ...providers: NgtAnyFunction[]) {
  return (sub: NgtAnyCtor) => {
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
  TProvideValue = TTokenValue extends object ? Partial<TTokenValue> : TTokenValue
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
  TCtor extends NgtAnyCtor<TInstanceType> = NgtAnyCtor<TInstanceType>
>(
  description: string,
  hostOrProviderFactory?: NgtAnyFunction<Provider> | true,
  ...providersFactory: NgtAnyFunction<Provider>[]
): [
  injectFn: (options?: InjectOptions) => NgtAnyFunction<NgtRef<TInstanceType>>,
  providedFn: <TProvideCtor extends TCtor = TCtor>(
    sub: TProvideCtor,
    factory?: (instance: InstanceType<TProvideCtor>) => NgtRef
  ) => Provider,
  token: InjectionToken<NgtAnyFunction<NgtRef<TInstanceType>>>
] {
  if (typeof hostOrProviderFactory === 'function') {
    providersFactory = [hostOrProviderFactory, ...providersFactory];
  }

  const injectionToken = new InjectionToken(description);

  function injectFn(options: InjectOptions = {}) {
    return inject(injectionToken, options) as NgtAnyFunction<NgtRef>;
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

          if (typeof hostOrProviderFactory === 'boolean') {
            return (instance as any)['parentRef'];
          }

          return () => (instance as any)['instanceRef'];
        },
        deps: [sub],
      },
    ];
  }

  return [injectFn, providerFn, injectionToken];
}
