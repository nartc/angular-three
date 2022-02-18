import {
    applicationGenerator,
    libraryGenerator,
} from '@nrwl/angular/generators';
import { readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { ANGULAR_THREE_VERSION } from '../versions';
import generator from './generator';

describe('configure cannon generator', () => {
    let appTree: Tree;

    describe('library-type project', () => {
        it('should exit early if a project is a library', async () => {
            appTree = createTreeWithEmptyWorkspace();
            await libraryGenerator(appTree, {
                name: 'lib',
            });

            generator(appTree, { project: 'lib' }).catch((error) => {
                expect(error).toBeTruthy();
            });
        });
    });

    describe('application-type project', () => {
        beforeEach(async () => {
            appTree = createTreeWithEmptyWorkspace();
            await applicationGenerator(appTree, {
                name: 'demo',
                e2eTestRunner: 'none' as any,
                routing: false,
                style: 'css',
                unitTestRunner: 'none' as any,
                inlineStyle: true,
                inlineTemplate: true,
                linter: 'none' as any,
                skipFormat: true,
                skipPackageJson: true,
                skipTests: true,
            });
        });

        it('should run generator successfully', () => {
            expect(async () => {
                await generator(appTree, { project: 'demo' });
            }).not.toThrow();
        });

        it('should add correct configurations', async () => {
            await generator(appTree, { project: 'demo' });

            const projectConfiguration = readProjectConfiguration(
                appTree,
                'demo'
            );

            const packageJson = readJson(appTree, 'package.json');

            // package.json
            expect(packageJson.dependencies['@angular-three/cannon']).toEqual(
                ANGULAR_THREE_VERSION
            );

            const tsConfig = readJson(
                appTree,
                `${projectConfiguration.root}/tsconfig.worker.json`
            );
            // tsconfig
            expect(tsConfig.include[0]).toContain(
                'node_modules/@angular-three/cannon/**/worker.ts'
            );

            // project configuration
            expect(
                projectConfiguration.targets['build'].options.webWorkerTsConfig
            ).toEqual(`${projectConfiguration.root}/tsconfig.worker.json`);
        });
    });
});
