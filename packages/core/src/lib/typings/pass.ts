export type WithoutSceneCameraConstructorParameters<
  T,
  TReturn = T extends [infer First, infer Second, ...infer Rest] ? Rest : T
> = TReturn;
