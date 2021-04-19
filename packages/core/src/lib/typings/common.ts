export type UnknownRecord = Record<string, unknown>;
export type AnyConstructor<TObject> = new (...args: any[]) => TObject;
