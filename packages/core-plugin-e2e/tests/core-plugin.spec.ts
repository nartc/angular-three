import {
  ensureNxProject,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('core-plugin e2e', () => {
  it('should create core-plugin', async () => {
    const plugin = uniq('core-plugin');
    ensureNxProject('@angular-three/core', 'dist/packages/core');
    await runNxCommandAsync(`generate @angular-three/core:init ${plugin}`);
  }, 120000);
});
