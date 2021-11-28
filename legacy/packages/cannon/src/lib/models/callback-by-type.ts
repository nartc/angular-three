export type CallbackByType<T extends { type: string }> = {
  [K in T['type']]?: T extends { type: K } ? (e: T) => void : never;
};
