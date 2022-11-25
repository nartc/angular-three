import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import generator, { ANGULAR_THREE_VERSION, THREE_TYPES_VERSION, THREE_VERSION } from './generator';

describe('init generator', () => {
    let appTree: Tree;

    beforeEach(() => {
        appTree = createTreeWithEmptyWorkspace();
    });

    it('should add three dependencies', async () => {
        await generator(appTree);

        const packageJson = readJson(appTree, 'package.json');

        expect(packageJson.dependencies['@angular-three/core']).toEqual(ANGULAR_THREE_VERSION);
        expect(packageJson.dependencies['three']).toEqual(THREE_VERSION);
        expect(packageJson.devDependencies['@types/three']).toEqual(THREE_TYPES_VERSION);
    });

    it('should update skipLibCheck in tsconfig.base.json', async () => {
        await generator(appTree);

        const tsConfig = readJson(appTree, 'tsconfig.base.json');
        expect(tsConfig.compilerOptions.skipLibCheck).toEqual(true);
    });

    it('should update skipLibCheck in tsconfig.json', async () => {
        appTree.rename('tsconfig.base.json', 'tsconfig.json');
        await generator(appTree);

        const tsConfig = readJson(appTree, 'tsconfig.json');
        expect(tsConfig.compilerOptions.skipLibCheck).toEqual(true);
    });
});
