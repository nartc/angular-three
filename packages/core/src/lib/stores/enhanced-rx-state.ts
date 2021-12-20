import { Directive } from '@angular/core';
import { createSideEffectObservable, RxState } from '@rx-angular/state';
import { catchError, EMPTY, noop, Observable, Subject, tap } from 'rxjs';

// From RxAngular

type SubjectMap<T> = { [K in keyof T]: Subject<T[K]> };

export type ValuesOf<O> = O[keyof O];
// type Keys = KeysOf<{ a: string, b: number }>; // "a" | "b"
export type KeysOf<O> = keyof O;

// class vs instance
type InstanceOrType<T> = T extends abstract new (...args: any) => infer R
  ? R
  : T;

// We infer all arguments instead of just the first one as we are more flexible for later changes
type InferArguments<T> = T extends (...args: infer R) => any ? R : never;

// It helps to infer the type of an objects key
// We have to use it because using just U[K] directly would @TODO
type Select<U, K> = K extends keyof U ? U[K] : never;

type ExtractString<T extends object> = Extract<keyof T, string>;

// Helper to get either the params of the transform function, or if the function is not present a fallback type
type FunctionParamsOrValueType<U, K, F> = InferArguments<
  Select<U, K>
> extends never
  ? [F]
  : InferArguments<Select<U, K>>;

export type Actions = {};

export type ActionTransforms<T extends {}> = Partial<{
  [K in keyof T]: (...args: any[]) => T[K];
}>;

export type ActionDispatchFn<O extends unknown[]> = (
  ...value: InstanceOrType<O>
) => void;

export type ActionDispatchers<T extends Actions, U extends {}> = {
  [K in keyof T]: ActionDispatchFn<
    FunctionParamsOrValueType<U, K, Select<T, K>>
  >;
};

export type ActionObservables<T extends Actions> = {
  [K in ExtractString<T> as `${K}$`]: Observable<InstanceOrType<T[K]>>;
};

export type RxActions<T extends Actions, U extends {} = T> = ActionDispatchers<
  T,
  U
> &
  ActionObservables<T>;

function actionProxyHandler<T, U>(
  subjects: SubjectMap<T>,
  transforms?: U
): ProxyHandler<RxActions<T, U>> {
  return {
    get(_, property: string) {
      type KeysOfT = KeysOf<T>;
      type ValuesOfT = ValuesOf<T>;

      const prop = property as KeysOfT;

      // the user wants to get a observable
      if (prop.toString().split('').pop() === '$') {
        const propName = prop.toString().slice(0, -1) as KeysOfT;
        subjects[propName] = subjects[propName] || new Subject<ValuesOfT>();
        return subjects[propName];
      }

      // the user wants to get a dispatcher function
      return (args: ValuesOfT) => {
        subjects[prop] = subjects[prop] || new Subject<ValuesOfT>();
        const val =
          transforms && (transforms as any)[prop]
            ? (transforms as any)[prop](args)
            : args;
        subjects[prop].next(val);
      };
    },
    set() {
      throw new Error('No setters available. To emit call the property name.');
    },
  };
}

@Directive()
export abstract class EnhancedRxState<
  T extends object = {},
  TActions extends object = {}
> extends RxState<T> {
  private subjects: SubjectMap<TActions> = {} as SubjectMap<TActions>;

  private effect$ = createSideEffectObservable();
  private effectSubscription = this.effect$.subscribe();

  ngOnDestroy() {
    super.ngOnDestroy();
    this.effectSubscription.unsubscribe();
    this.destroy();
  }

  create<U extends ActionTransforms<TActions> = {}>(
    transforms?: U
  ): RxActions<TActions, U> {
    return new Proxy(
      {} as RxActions<TActions, U>,
      actionProxyHandler(this.subjects, transforms)
    ) as RxActions<TActions, U>;
  }

  destroy() {
    for (const subjectsKey in this.subjects) {
      this.subjects[subjectsKey].complete();
    }
  }

  holdEffect<S>(
    obsOrObsWithSideEffect: Observable<S>,
    sideEffectFn: (
      value: S,
      firstRun: boolean
    ) =>
      | ((previousValue: S | undefined, isUnsubscribed: boolean) => void)
      | void
  ): void {
    let cleanupFn: (
      previousValue: S | undefined,
      isUnsubscribed: boolean
    ) => void = noop;
    let firstRun = false;
    let latestValue: S | undefined = undefined;

    const sideEffect = obsOrObsWithSideEffect.pipe(catchError((_) => EMPTY));

    this.effect$.nextEffectObservable(
      sideEffect.pipe(
        tap({
          next: (value: S) => {
            if (cleanupFn && firstRun) {
              cleanupFn(latestValue, false);
            }

            const cleanUpOrVoid = sideEffectFn(value, firstRun);
            if (cleanUpOrVoid) {
              cleanupFn = cleanUpOrVoid;
            }

            latestValue = value;

            if (!firstRun) {
              firstRun = true;
            }
          },
          unsubscribe: () => {
            if (cleanupFn) {
              cleanupFn(latestValue, true);
            }
          },
        })
      )
    );
  }
}

export function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}
