import { inject, InjectionToken, InjectOptions, Provider } from '@angular/core';

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
