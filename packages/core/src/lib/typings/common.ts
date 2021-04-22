export type UnknownRecord = Record<string, unknown>;
export type AnyConstructor<TObject> = new (...args: any[]) => TObject;
export type RecursivePartial<T> = Partial<
  {
    [key in keyof T]: T[key] extends (...a: Array<infer U>) => any
      ? (
          ...args: Array<U>
        ) => RecursivePartial<ReturnType<T[key]>> | ReturnType<T[key]>
      : T[key] extends Array<any>
      ? Array<RecursivePartial<T[key][number]>>
      : RecursivePartial<T[key]> | T[key];
  }
>;
