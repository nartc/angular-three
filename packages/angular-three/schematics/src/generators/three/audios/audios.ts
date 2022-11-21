import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';

export const audios = [
  [THREE.Audio.name, 'GainNode'],
  [THREE.PositionalAudio.name, 'PannerNode'],
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

  const generatedAudios = [];
  for (const [audio, audioNode] of audios) {
    const normalizedNames = names(audio);

    generateFiles(tree, join(__dirname, 'files/lib'), join(audioDir, 'src', 'lib', normalizedNames.fileName), {
      ...normalizedNames,
      audioNode,
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
