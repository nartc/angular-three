import { checkUpdate } from './check-update';
import { instanceLocalState } from './instance-local-state';

export function invalidateInstance<TInstance extends object>(instance: TInstance) {
  const state = instanceLocalState(instance)?.store.getState();
  if (state && state?.internal?.frames === 0) state.invalidate();
  checkUpdate(instance);
}
