import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  logger,
  names,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';

const materials = [
  [THREE.ShadowMaterial.name, 'ShadowMaterialParameters'],
  [THREE.SpriteMaterial.name, 'SpriteMaterialParameters'],
  [THREE.RawShaderMaterial.name, 'ShaderMaterialParameters'],
  [THREE.ShaderMaterial.name, 'ShaderMaterialParameters'],
  [THREE.PointsMaterial.name, 'PointsMaterialParameters'],
  [THREE.MeshPhysicalMaterial.name, 'MeshPhysicalMaterialParameters'],
  [THREE.MeshStandardMaterial.name, 'MeshStandardMaterialParameters'],
  [THREE.MeshPhongMaterial.name, 'MeshPhongMaterialParameters'],
  [THREE.MeshToonMaterial.name, 'MeshToonMaterialParameters'],
  [THREE.MeshNormalMaterial.name, 'MeshNormalMaterialParameters'],
  [THREE.MeshLambertMaterial.name, 'MeshLambertMaterialParameters'],
  [THREE.MeshDepthMaterial.name, 'MeshDepthMaterialParameters'],
  [THREE.MeshDistanceMaterial.name, 'MeshDistanceMaterialParameters'],
  [THREE.MeshBasicMaterial.name, 'MeshBasicMaterialParameters'],
  [THREE.MeshMatcapMaterial.name, 'MeshMatcapMaterialParameters'],
  [THREE.LineDashedMaterial.name, 'LineDashedMaterialParameters'],
  [THREE.LineBasicMaterial.name, 'LineBasicMaterialParameters'],
];

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
  for (const [material, parameters] of materials) {
    const normalizedNames = names(material);

    generateFiles(
      tree,
      join(__dirname, 'files/lib'),
      join(materialDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        material,
        parameters,
        tmpl: '',
      }
    );

    generatedMaterials.push(normalizedNames.fileName);
    generateFiles(
      tree,
      join(__dirname, 'files/index'),
      join(materialDir, 'src'),
      {
        items: generatedMaterials,
        tmpl: '',
      }
    );
  }

  await formatFiles(tree);
}
