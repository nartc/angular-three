import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import {
  generateFiles,
  getWorkspaceLayout,
  logger,
  names,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';
import {
  isClassDeclaration,
  isConstructorDeclaration,
  ParameterDeclaration,
  PropertySignature,
  SourceFile,
} from 'typescript/lib/tsserverlibrary';
import { astFromPath, pathToSourceFile } from '../common/ast-utils';

const baseTexturePath = 'node_modules/@types/three/src/textures/Texture.d.ts';

export const textures = [
  {
    name: THREE.CanvasTexture.name,
    defPath: 'node_modules/@types/three/src/textures/CanvasTexture.d.ts',
  },
  // TODO: CompressedArrayTexture isn't available in @types/three yet
  // {
  //   name: THREE.CompressedArrayTexture.name,
  //   defPath:
  //     'node_modules/@types/three/src/textures/CompressedArrayTexture.d.ts',
  // },
  {
    name: THREE.CompressedTexture.name,
    defPath: 'node_modules/@types/three/src/textures/CompressedTexture.d.ts',
  },
  {
    name: THREE.CubeTexture.name,
    defPath: 'node_modules/@types/three/src/textures/CubeTexture.d.ts',
  },
  {
    name: THREE.Data3DTexture.name,
    defPath: 'node_modules/@types/three/src/textures/Data3DTexture.d.ts',
  },
  {
    name: THREE.DataArrayTexture.name,
    defPath: 'node_modules/@types/three/src/textures/DataArrayTexture.d.ts',
  },
  {
    name: THREE.DataTexture.name,
    defPath: 'node_modules/@types/three/src/textures/DataTexture.d.ts',
  },
  {
    name: THREE.DepthTexture.name,
    defPath: 'node_modules/@types/three/src/textures/DepthTexture.d.ts',
  },
  {
    name: THREE.FramebufferTexture.name,
    defPath: 'node_modules/@types/three/src/textures/FramebufferTexture.d.ts',
  },
  {
    name: THREE.VideoTexture.name,
    defPath: 'node_modules/@types/three/src/textures/VideoTexture.d.ts',
  },
];

export default async function texturesGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const textureDir = join(libsDir, 'core', 'textures');

  logger.log('Generating textures...');

  if (!tree.exists(textureDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'textures',
      library: 'core',
      skipModule: true,
    });
  }

  const generatedTextures = [];

  for (const texture of textures) {
    const normalizedNames = names(texture.name);

    const inputRecord = astFromPath(tree, texture.defPath, (sourceFile) => {
      const mainParameters = [];
      const base: [
        string,
        SourceFile,
        (PropertySignature | ParameterDeclaration)[]
      ] = ['', null, []];

      sourceFile.forEachChild((node) => {
        if (isClassDeclaration(node)) {
          if (node.heritageClauses?.length) {
            const baseSourceFile = pathToSourceFile(tree, baseTexturePath);
            base[0] = 'Texture';
            base[1] = baseSourceFile;

            baseSourceFile.forEachChild((baseNode) => {
              if (isClassDeclaration(baseNode)) {
                baseNode.members.forEach((member) => {
                  if (isConstructorDeclaration(member)) {
                    member.parameters.forEach((parameter) => {
                      base[2].push(parameter);
                    });
                  }
                });
              }
            });
          }

          node.members.forEach((member) => {
            if (isConstructorDeclaration(member)) {
              member.parameters.forEach((parameter) => {
                mainParameters.push(parameter);
              });
            }
          });
        }
      });

      return { mainProperties: mainParameters, base };
    });

    generateFiles(
      tree,
      join(__dirname, 'files/lib'),
      join(textureDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        tmpl: '',
        ...inputRecord,
      }
    );

    generatedTextures.push(normalizedNames.fileName);
  }

  generateFiles(
    tree,
    join(__dirname, '../common/files/index'),
    join(textureDir, 'src'),
    {
      items: generatedTextures,
      tmpl: '',
    }
  );
}
