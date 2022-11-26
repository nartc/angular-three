import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';
import { isClassDeclaration, PropertyDeclaration, SourceFile } from 'typescript/lib/tsserverlibrary';
import { astFromPath, handleClassMembers, handleHeritage } from '../common/ast-utils';

export const audios = [
    {
        name: THREE.Audio.name,
        defPath: 'node_modules/@types/three/src/audio/Audio.d.ts',
    },
    {
        name: THREE.PositionalAudio.name,
        defPath: 'node_modules/@types/three/src/audio/PositionalAudio.d.ts',
    },
];

export default async function audiosGenerator(tree: Tree, ngtVersion: string) {
    const { libsDir } = getWorkspaceLayout(tree);
    const audioDir = join(libsDir, 'core', 'audios');

    logger.log('Generating audios...');

    if (!tree.exists(audioDir)) {
        await librarySecondaryEntryPointGenerator(tree, {
            name: 'audios',
            library: 'core',
            skipModule: true,
        });
    }

    let hasObject3D = false;
    const generatedAudios = [];
    for (const { name, defPath } of audios) {
        const normalizedNames = names(name);

        const inputRecord = astFromPath(tree, defPath, (sourceFile) => {
            const properties = new Map();
            const bases = new Map();

            function runAudioSourceFile(sF: SourceFile, props: Map<string, PropertyDeclaration>) {
                sF.forEachChild((node) => {
                    if (isClassDeclaration(node)) {
                        if (node.heritageClauses?.length) {
                            handleHeritage(
                                tree,
                                sF,
                                node,
                                (heritageName) => audios.find((audio) => audio.name === heritageName)?.defPath,
                                bases,
                                runAudioSourceFile
                            );
                        }

                        handleClassMembers(sF, node, props, true, ['listener', 'context', 'gain', 'panner']);
                    }
                });
            }

            runAudioSourceFile(sourceFile, properties);

            return { properties, bases };
        });

        if (!hasObject3D) {
            hasObject3D = inputRecord.hasObject3D;
        }

        generateFiles(tree, join(__dirname, 'files/lib'), join(audioDir, 'src', 'lib', normalizedNames.fileName), {
            ...normalizedNames,
            ...inputRecord,
            tmpl: '',
            ngtVersion,
        });

        generatedAudios.push(normalizedNames.fileName);
    }

    generateFiles(tree, join(__dirname, '../common/files/index'), join(audioDir, 'src'), {
        items: [...generatedAudios, 'audio-listener'],
        tmpl: '',
        ngtVersion,
    });

    generateFiles(tree, join(__dirname, '../common/files/inputs-outputs'), join(audioDir, 'src/lib'), {
        tmpl: '',
        ngtVersion,
        hasObject3D,
    });
}
