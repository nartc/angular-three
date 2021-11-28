export type UnknownRecord = Record<string, unknown>;
export type AnyConstructor<TObject> = new (...args: any[]) => TObject;
export type AnyExtenderFunction<TObject> = (object: TObject) => void;

export type Properties<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]
>;

export type ConditionalType<Child, Parent, Truthy, Falsy> = Child extends Parent
  ? Truthy
  : Falsy;

export type BranchingReturn<
  T = any,
  Parent = any,
  Coerced = any
> = ConditionalType<T, Parent, Coerced, T>;

export type LessFirstConstructorParameters<
  T extends AnyConstructor<any>,
  TConstructor = ConstructorParameters<T>
> = TConstructor extends [infer First, ...infer Rest] ? Rest : TConstructor;
export type LessFirstTwoConstructorParameters<
  T extends AnyConstructor<any>,
  TConstructor = ConstructorParameters<T>
> = TConstructor extends [infer First, infer Second, ...infer Rest]
  ? Rest
  : TConstructor;
