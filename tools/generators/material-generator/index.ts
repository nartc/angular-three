import {
  apply,
  applyTemplates,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  url,
} from '@angular-devkit/schematics';
import { camelize, dasherize } from '@nrwl/workspace/src/utils/strings';
import * as path from 'path';

const materials = [
  'ShadowMaterial',
  'SpriteMaterial',
  'RawShaderMaterial',
  'ShaderMaterial',
  'PointsMaterial',
  'MeshPhysicalMaterial',
  'MeshStandardMaterial',
  'MeshPhongMaterial',
  'MeshToonMaterial',
  'MeshNormalMaterial',
  'MeshLambertMaterial',
  'MeshDepthMaterial',
  'MeshDistanceMaterial',
  'MeshBasicMaterial',
  'MeshMatcapMaterial',
  'LineDashedMaterial',
  'LineBasicMaterial',
];

export default function (): Rule {
  return (_, context) => {
    context.logger.info('Generating THREE Materials');

    const templates = materials.map((material) => {
      return mergeWith(
        apply(url('./files/directive'), [
          applyTemplates({
            material,
            dasherize,
            camelize,
          }),
          move(
            path.normalize(
              `./packages/core/materials/src/lib/${dasherize(material)}`
            )
          ),
        ]),
        MergeStrategy.Overwrite
      );
    });

    const indexTemplate = mergeWith(
      apply(url('./files/index'), [
        applyTemplates({ materials, dasherize }),
        move(path.normalize(`./packages/core/materials/src`)),
      ]),
      MergeStrategy.Overwrite
    );

    return chain([...templates, indexTemplate]);
  };
}
