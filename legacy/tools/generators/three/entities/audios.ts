import * as THREE from 'three';
import { EntityCollection } from '../models/entity-collection.model';

export const audios: EntityCollection = {
  core: [
    {
      name: THREE.Audio.name,
      abstractGenerics: { main: THREE.Audio.name, secondary: 'GainNode' },
    },
    {
      name: THREE.PositionalAudio.name,
      abstractGenerics: {
        main: THREE.PositionalAudio.name,
        secondary: 'PannerNode',
      },
    },
  ],
};
