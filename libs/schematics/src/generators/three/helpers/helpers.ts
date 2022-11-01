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
} from 'typescript/lib/tsserverlibrary';
import { astFromPath } from '../common/ast-utils';

export const helpers = [
  {
    name: THREE.ArrowHelper.name,
    defPath: 'node_modules/@types/three/src/helpers/ArrowHelper.d.ts',
  },
  {
    name: THREE.AxesHelper.name,
    defPath: 'node_modules/@types/three/src/helpers/AxesHelper.d.ts',
  },
  {
    name: THREE.GridHelper.name,
    defPath: 'node_modules/@types/three/src/helpers/GridHelper.d.ts',
  },
  {
    name: THREE.PolarGridHelper.name,
    defPath: 'node_modules/@types/three/src/helpers/PolarGridHelper.d.ts',
  },
];

export const objectHelpers = [
  THREE.BoxHelper.name,
  THREE.Box3Helper.name,
  THREE.CameraHelper.name,
  THREE.DirectionalLightHelper.name,
  THREE.HemisphereLightHelper.name,
  THREE.PlaneHelper.name,
  THREE.PointLightHelper.name,
  THREE.SkeletonHelper.name,
  THREE.SpotLightHelper.name,
];

export default async function helpersGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const helperDir = join(libsDir, 'core', 'helpers');

  logger.log('Generating helpers...');

  if (!tree.exists(helperDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'helpers',
      library: 'core',
      skipModule: true,
    });
  }

  const generatedHelpers = [];
  for (const helper of helpers) {
    const normalizedNames = names(helper.name);

    const inputRecord = astFromPath(tree, helper.defPath, (sourceFile) => {
      const mainParameters = [];
      sourceFile.forEachChild((node) => {
        if (isClassDeclaration(node)) {
          node.members.forEach((member) => {
            if (isConstructorDeclaration(member)) {
              member.parameters.forEach((parameter) => {
                if (parameter.name.getText(sourceFile) !== 'color') {
                  mainParameters.push(parameter);
                }
              });
            }
          });
        }
      });

      return { mainProperties: mainParameters };
    });

    generateFiles(
      tree,
      join(__dirname, 'files/helpers'),
      join(helperDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        objectHelper: false,
        tmpl: '',
        ...inputRecord,
      }
    );

    generatedHelpers.push(normalizedNames.fileName);
  }

  const generatedObjectHelpers = [];
  for (const objectHelper of objectHelpers) {
    const normalizedNames = names(objectHelper);

    generateFiles(
      tree,
      join(__dirname, 'files/object-helpers'),
      join(helperDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        objectHelper: true,
        tmpl: '',
      }
    );

    generatedObjectHelpers.push(normalizedNames.fileName);
  }

  generateFiles(
    tree,
    join(__dirname, '../common/files/index'),
    join(helperDir, 'src'),
    {
      items: [...generatedHelpers, ...generatedObjectHelpers],
      tmpl: '',
    }
  );
}
