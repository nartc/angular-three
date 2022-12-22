import type { InjectOptions, Provider, Type } from '@angular/core';
import { inject, InjectionToken } from '@angular/core';

export interface InjectFn<T> {
  (): T;
  (options: InjectOptions & { optional?: false }): T;
  (options: InjectOptions & { optional?: true }): T | null;
}

/**
 * A function that returns a strongly-typed InjectFn for a token
 *
 * @example
 *
 * ```ts
 * @Injectable()
 * export class TodosStore {}
 *
 * export const injectTodosStore = createInject(TodosStore);
 *
 * const store = injectTodosStore(); // TodosStore
 * const parentStore = injectTodosStore({ skipSelf: true }); // TodosStore
 * const maybeStore = injectTodosStore({ optional: true }); // TodosStore | null
 * ```
 *
 */
export function createInject<T>(token: Type<T> | InjectionToken<T>): InjectFn<T> {
  return ((options) => inject(token, options || {})) as InjectFn<T>;
}

export interface ProvideFn<T> {
  (): Provider;
  (value: T | Partial<T>): Provider;
  (token: Type<T>, mode: 'useClass' | 'useExisting'): Provider;
  (deps: Type<any>[], factory: (...args: any[]) => T): Provider;
}

/**
 * A function that returns a strongly-typed ProvideFn for a token
 *
 * @example
 *
 * ```ts
 * @Injectable()
 * export class TodosStore {}
 *
 * const provideTodosStore = createProvide(TodosStore);
 *
 * providers: [provideTodosStore] // [TodosStore]
 * providers: [provideTodosStore(new TodosStore())]; // { provide: TodosStore, useValue }
 * providers: [provideTodosStore(BetterTodosStore, 'useClass')]; // { provide: TodosStore, useExisting: BetterTodosStore }
 * providers: [provideTodosStore([Router], (router: Router) => new TodosStore(router)); // { provide: TodosStore, useFactory, deps: [Router] }
 * ```
 */
export function createProvide<T>(token: Type<T> | InjectionToken<T>): ProvideFn<T> {
  return (...args: any[]): Provider => {
    const { data, mode } = processProvideArgs(args) || { data: {} };

    if (!mode) return [token];

    const provider = { provide: token };
    provider[mode as keyof typeof provider] = data.value;

    if (mode === 'useFactory') {
      (provider as Record<string, unknown>)['deps'] = data.deps || [];
    }

    return provider as Provider;
  };
}

/**
 * A function that returns an `InjectionToken` along with
 * the `InjectFn` and `ProvideFn`
 *
 * @example
 *
 * ```ts
 * export const [injectBaseUrl, provideBaseUrl, BASE_URL] = createInjectionToken<string>('Base URL');
 * ```
 */
export function createInjectionToken<T>(
  description: string,
  defaultValueOrFactory?: T | (() => T)
): [InjectFn<T>, ProvideFn<T>, InjectionToken<T>] {
  let token = new InjectionToken<T>(description);

  if (defaultValueOrFactory) {
    token = new InjectionToken<T>(description, {
      factory:
        typeof defaultValueOrFactory === 'function'
          ? (defaultValueOrFactory as () => T)
          : () => defaultValueOrFactory,
    });
  }

  return [createInject(token), createProvide(token), token];
}

function processProvideArgs(args: any[]): {
  data: { value: any; deps?: any[] };
  mode: 'useValue' | 'useFactory' | 'useExisting' | 'useClass';
} | null {
  if (args.length === 1) {
    return { data: { value: args[0] }, mode: 'useValue' };
  }

  if (args.length === 2) {
    const [first, second] = args;
    if (Array.isArray(first) && typeof second === 'function') {
      return { data: { value: second, deps: first }, mode: 'useFactory' };
    }

    return { data: { value: first }, mode: second };
  }

  return null;
}
