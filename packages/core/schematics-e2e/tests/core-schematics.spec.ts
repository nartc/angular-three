import { ensureNxProject, runNxCommandAsync } from '@nrwl/nx-plugin/testing';

describe('core-schematics e2e', () => {
    // Setting up individual workspaces per
    // test can cause e2e runs to take a long time.
    // For this reason, we recommend each suite only
    // consumes 1 workspace. The tests should each operate
    // on a unique project in the workspace, such that they
    // are not dependant on one another.
    beforeAll(() => {
        ensureNxProject('core-schematics', 'dist/packages/core/schematics');
    });

    afterAll(() => {
        // `nx reset` kills the daemon, and performs
        // some work which can help clean up e2e leftovers
        runNxCommandAsync('reset');
    });
});
