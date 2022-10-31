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
  Identifier,
  isInterfaceDeclaration,
  isPropertySignature,
  PropertySignature,
  SourceFile,
} from 'typescript/lib/tsserverlibrary';
import { astFromPath, pathToSourceFile } from '../common/ast-utils';
import { typeDefFactory } from '../common/type-def-factory';

const baseMaterialPath =
  'node_modules/@types/three/src/materials/Material.d.ts';

const materials = [
  {
    name: THREE.LineBasicMaterial.name,
    parameters: 'LineBasicMaterialParameters',
    typeDef: {
      generic: 'TLineBasicMaterial',
      extends: 'THREE.LineBasicMaterial',
      default: 'THREE.LineBasicMaterial',
    },
    defPath: 'node_modules/@types/three/src/materials/LineBasicMaterial.d.ts',
  },
  {
    name: THREE.LineDashedMaterial.name,
    parameters: 'LineDashedMaterialParameters',
    extend: {
      material: 'NgtLineBasicMaterial',
      path: '../line-basic-material/line-basic-material',
    },
    defPath: 'node_modules/@types/three/src/materials/LineDashedMaterial.d.ts',
  },
  {
    name: THREE.MeshBasicMaterial.name,
    parameters: 'MeshBasicMaterialParameters',
    defPath: 'node_modules/@types/three/src/materials/MeshBasicMaterial.d.ts',
  },
  {
    name: THREE.MeshDepthMaterial.name,
    parameters: 'MeshDepthMaterialParameters',
    defPath: 'node_modules/@types/three/src/materials/MeshDepthMaterial.d.ts',
  },
  {
    name: THREE.MeshDistanceMaterial.name,
    parameters: 'MeshDistanceMaterialParameters',
    defPath:
      'node_modules/@types/three/src/materials/MeshDistanceMaterial.d.ts',
  },
  {
    name: THREE.MeshLambertMaterial.name,
    parameters: 'MeshLambertMaterialParameters',
    defPath: 'node_modules/@types/three/src/materials/MeshLambertMaterial.d.ts',
  },
  {
    name: THREE.MeshMatcapMaterial.name,
    parameters: 'MeshMatcapMaterialParameters',
    defPath: 'node_modules/@types/three/src/materials/MeshMatcapMaterial.d.ts',
  },
  {
    name: THREE.MeshNormalMaterial.name,
    parameters: 'MeshNormalMaterialParameters',
    defPath: 'node_modules/@types/three/src/materials/MeshNormalMaterial.d.ts',
  },
  {
    name: THREE.MeshPhongMaterial.name,
    parameters: 'MeshPhongMaterialParameters',
    defPath: 'node_modules/@types/three/src/materials/MeshPhongMaterial.d.ts',
  },
  {
    name: THREE.MeshPhysicalMaterial.name,
    parameters: 'MeshPhysicalMaterialParameters',
    extend: {
      material: 'NgtMeshStandardMaterial',
      path: '../mesh-standard-material/mesh-standard-material',
    },
    defPath:
      'node_modules/@types/three/src/materials/MeshPhysicalMaterial.d.ts',
  },
  {
    name: THREE.MeshStandardMaterial.name,
    parameters: 'MeshStandardMaterialParameters',
    typeDef: {
      generic: 'TStandardMaterial',
      extends: 'THREE.MeshStandardMaterial',
      default: 'THREE.MeshStandardMaterial',
    },
    defPath:
      'node_modules/@types/three/src/materials/MeshStandardMaterial.d.ts',
  },
  {
    name: THREE.MeshToonMaterial.name,
    parameters: 'MeshToonMaterialParameters',
    defPath: 'node_modules/@types/three/src/materials/MeshToonMaterial.d.ts',
  },
  {
    name: THREE.PointsMaterial.name,
    parameters: 'PointsMaterialParameters',
    defPath: 'node_modules/@types/three/src/materials/PointsMaterial.d.ts',
  },
  {
    name: THREE.RawShaderMaterial.name,
    parameters: 'ShaderMaterialParameters',
    defPath: 'node_modules/@types/three/src/materials/RawShaderMaterial.d.ts',
  },
  {
    name: THREE.ShaderMaterial.name,
    parameters: 'ShaderMaterialParameters',
    defPath: 'node_modules/@types/three/src/materials/ShaderMaterial.d.ts',
  },
  {
    name: THREE.ShadowMaterial.name,
    parameters: 'ShadowMaterialParameters',
    defPath: 'node_modules/@types/three/src/materials/ShadowMaterial.d.ts',
  },
  {
    name: THREE.SpriteMaterial.name,
    parameters: 'SpriteMaterialParameters',
    defPath: 'node_modules/@types/three/src/materials/SpriteMaterial.d.ts',
  },
];

const parameterInheritanceMap = new Map();

export default async function materialsGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const materialDir = join(libsDir, 'core', 'materials');

  logger.log('Generating materials...');

  if (!tree.exists(materialDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'materials',
      library: 'core',
      skipModule: true,
    });
  }

  const generatedMaterials = [];
  for (const { name, parameters, typeDef, extend, defPath } of materials) {
    const normalizedNames = names(name);

    const inputRecord = astFromPath(tree, defPath, (sourceFile) => {
      const mainProperties = [];
      const base: [string, SourceFile, PropertySignature[]] = ['', null, []];

      sourceFile.forEachChild((node) => {
        if (isInterfaceDeclaration(node)) {
          if (node.heritageClauses?.length) {
            const baseParameter = (
              node.heritageClauses[0].types[0].expression as Identifier
            ).getText(sourceFile);
            const baseDtsPath =
              baseParameter === 'MaterialParameters'
                ? baseMaterialPath
                : materials.find(
                    (material) => material.parameters === baseParameter
                  )?.defPath;
            if (baseDtsPath) {
              const baseSourceFile = pathToSourceFile(tree, baseDtsPath);
              base[0] = baseParameter;
              base[1] = baseSourceFile;

              baseSourceFile.forEachChild((baseNode) => {
                if (isInterfaceDeclaration(baseNode)) {
                  baseNode.forEachChild((baseChildNode) => {
                    if (isPropertySignature(baseChildNode)) {
                      base[2].push(baseChildNode);
                    }
                  });
                }
              });
            }
          }

          node.forEachChild((childNode) => {
            if (isPropertySignature(childNode)) {
              mainProperties.push(childNode);
            }
          });
        }
      });

      return { mainProperties, base };
    });

    generateFiles(
      tree,
      join(__dirname, 'files/lib'),
      join(materialDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        material: name,
        parameters,
        tmpl: '',
        typeDef,
        typeDefFactory,
        extend,
        ...inputRecord,
      }
    );

    generatedMaterials.push(normalizedNames.fileName);
  }

  generateFiles(
    tree,
    join(__dirname, '../common/files/index'),
    join(materialDir, 'src'),
    {
      items: generatedMaterials,
      tmpl: '',
    }
  );
}
