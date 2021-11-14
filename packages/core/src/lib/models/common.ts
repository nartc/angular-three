export type UnknownRecord = Record<string, unknown>;
export type AnyConstructor<TObject> = new (...args: any[]) => TObject;

export type ConditionalType<Child, Parent, Truthy, Falsy> = Child extends Parent
  ? Truthy
  : Falsy;

export type BranchingReturn<
  T = any,
  Parent = any,
  Coerced = any
> = ConditionalType<T, Parent, Coerced, T>;

export type LessFirstConstructorParameters<
  T,
  TReturn = T extends [infer First, ...infer Rest] ? Rest : T
> = TReturn;
export type LessFirstTwoConstructorParameters<
  T,
  TReturn = T extends [infer First, infer Second, ...infer Rest] ? Rest : T
> = TReturn;
