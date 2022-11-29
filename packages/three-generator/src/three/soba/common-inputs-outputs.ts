import { generateFiles, getWorkspaceLayout, logger, Tree } from '@nrwl/devkit';
import { join } from 'path';

export default async function commonInputsOutputsGenerator(tree: Tree, ngtVersion: string) {
    const { libsDir } = getWorkspaceLayout(tree);
    const sobaLibs = ['cameras', 'controls', 'abstractions'];

    logger.log('Generating common for soba...');
    for (const lib of sobaLibs) {
        const libDir = join(libsDir, 'soba', lib);
        generateFiles(tree, join(__dirname, '../common/files/inputs-outputs'), join(libDir, 'src/lib'), {
            tmpl: '',
            ngtVersion,
            hasObject3D: true,
        });
    }
}
