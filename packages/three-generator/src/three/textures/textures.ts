import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';

export const textures = [
    THREE.CanvasTexture.name,
    THREE.CompressedArrayTexture.name,
    THREE.CompressedTexture.name,
    THREE.CubeTexture.name,
    THREE.Data3DTexture.name,
    THREE.DataArrayTexture.name,
    THREE.DataTexture.name,
    THREE.DepthTexture.name,
    THREE.FramebufferTexture.name,
    THREE.VideoTexture.name,
];

export default async function texturesGenerator(tree: Tree, ngtVersion: string) {
    const { libsDir } = getWorkspaceLayout(tree);
    const textureDir = join(libsDir, 'angular-three', 'textures');

    logger.log('Generating textures...');

    if (!tree.exists(textureDir)) {
        await librarySecondaryEntryPointGenerator(tree, {
            name: 'textures',
            library: 'angular-three',
            skipModule: true,
        });
    }

    const generatedTextures = [];

    for (const texture of textures) {
        const normalizedNames = names(texture);

        generateFiles(tree, join(__dirname, 'files/lib'), join(textureDir, 'src', 'lib', normalizedNames.fileName), {
            ...normalizedNames,
            tmpl: '',
            ngtVersion,
            hasObject3D: false,
        });

        generatedTextures.push(normalizedNames.fileName);
    }

    generateFiles(tree, join(__dirname, '../common/files/index'), join(textureDir, 'src'), {
        items: generatedTextures,
        tmpl: '',
        ngtVersion,
    });

    generateFiles(tree, join(__dirname, '../common/files/inputs-outputs'), join(textureDir, 'src/lib'), {
        tmpl: '',
        ngtVersion,
        hasObject3D: false,
    });
}
