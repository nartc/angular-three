export type UnknownRecord = Record<string, unknown>;
export type UnknownConstructor<TObject> = new (...args: unknown[]) => TObject;
