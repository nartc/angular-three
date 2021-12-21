import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  logger,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';

export default async function controllersGenerator(
  tree: Tree,
  object3dSelectors: string[],
  audioSelectors: string[],
  lineSelectors: string[],
  sobaShapeSelectors: string[]
) {
  const meshSelectors = ['mesh', 'instanced-mesh', 'skinned-mesh'];

  const sobaSelectors = [
    'soba-billboard',
    'soba-detailed',
    'soba-line',
    'soba-quadratic-bezier-line',
    'soba-cubic-bezier-line',
    'soba-orthographic-camera',
  ];
  const sobaWithMaterialSelectors = ['soba-text'];
  const sobaAudioSelectors = ['soba-positional-audio'];

  const { libsDir } = getWorkspaceLayout(tree);
  const controllersDir = join(libsDir, 'core', 'src', 'lib', 'controllers');

  logger.log('Generating controllers...');

  const prefixedSobaSelectors = sobaShapeSelectors.map(
    (selector) => `soba-${selector}`
  );

  const selectors = [
    ...meshSelectors,
    ...audioSelectors,
    ...lineSelectors,
    ...object3dSelectors,
  ];

  // Object3dInputs includes the Soba shapes but Object3d does not
  const inputsSelectors = [
    ...selectors,
    ...prefixedSobaSelectors,
    ...sobaSelectors,
    ...sobaWithMaterialSelectors,
  ];

  generateFiles(tree, join(__dirname, 'files'), controllersDir, {
    tmpl: '',
    audioSelectors: [...audioSelectors, ...sobaAudioSelectors],
    meshSelectors,
    lineSelectors,
    sobaShapeSelectors: [
      ...prefixedSobaSelectors,
      ...sobaWithMaterialSelectors,
    ],
    selectors: Array.from(new Set(selectors)).map(mapIsLast),
    inputsSelectors: Array.from(new Set(inputsSelectors)).map(mapIsLast),
  });

  await formatFiles(tree);
}

function mapIsLast(selector: string, index: number, list: string[]) {
  return {
    selector,
    isLast: index === list.length - 1,
  };
}
