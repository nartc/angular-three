import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';
import { astFromPath, pathToSourceFile } from '../common/ast-utils';
import {
    isClassDeclaration,
    isConstructorDeclaration,
    isPropertyDeclaration,
    PropertyDeclaration,
    SourceFile,
} from 'typescript/lib/tsserverlibrary';

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
    const audioDir = join(libsDir, 'angular-three', 'audios');

    logger.log('Generating audios...');

    if (!tree.exists(audioDir)) {
        await librarySecondaryEntryPointGenerator(tree, {
            name: 'audios',
            library: 'angular-three',
            skipModule: true,
        });
    }

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
                            const baseName = node.heritageClauses[0].types[0].expression.getText(sF);
                            const baseDtsPath = audios.find((audio) => audio.name === baseName)?.defPath;
                            if (baseDtsPath) {
                                const baseSourceFile = pathToSourceFile(tree, baseDtsPath);
                                if (!bases.has(baseName)) {
                                    bases.set(baseName, { sourceFile: baseSourceFile, properties: new Map() });
                                }

                                runAudioSourceFile(baseSourceFile, bases.get(baseName).properties);
                            }
                        }

                        for (const member of node.members) {
                            // skip constructor
                            if (isConstructorDeclaration(member)) continue;
                            if (isPropertyDeclaration(member)) {
                                const propertyName = member.name.getText(sF);
                                // skip these properties
                                if (['type', 'listener', 'context', 'gain', 'panner'].includes(propertyName)) continue;

                                props.set(propertyName, member);
                            }
                        }
                    }
                });
            }

            runAudioSourceFile(sourceFile, properties);

            return { properties, bases };
        });

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
}
