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

export const lights = [
  THREE.LightProbe.name,
  THREE.AmbientLight.name,
  THREE.AmbientLightProbe.name,
  THREE.HemisphereLight.name,
  THREE.HemisphereLightProbe.name,
  THREE.DirectionalLight.name,
  THREE.PointLight.name,
  THREE.SpotLight.name,
  THREE.RectAreaLight.name,
];

export default async function lightsGenerator(tree: Tree): Promise<string[]> {
  const { libsDir } = getWorkspaceLayout(tree);
  const lightDir = join(libsDir, 'core', 'lights');

  logger.log('Generating lights...');

  if (!tree.exists(lightDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'lights',
      library: 'core',
      skipModule: true,
    });
  }

  const generatedLights = [];
  for (const light of lights) {
    const normalizedNames = names(light);

    generateFiles(
      tree,
      join(__dirname, 'files/lib'),
      join(lightDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        tmpl: '',
      }
    );

    generatedLights.push(normalizedNames.fileName);
    generateFiles(tree, join(__dirname, 'files/index'), join(lightDir, 'src'), {
      items: generatedLights,
      tmpl: '',
    });
  }

  await formatFiles(tree);

  return generatedLights;
}
