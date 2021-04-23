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

const lights = [
  'AmbientLight',
  'DirectionalLight',
  'HemisphereLight',
  'PointLight',
  'RectAreaLight',
  'SpotLight',
];

export default function (): Rule {
  return (_, context) => {
    context.logger.info('Generating THREE Materials');

    const templates = lights.map((light) => {
      return mergeWith(
        apply(url('./files/directive'), [
          applyTemplates({
            light,
            dasherize,
            camelize,
          }),
          move(
            path.normalize(`./packages/core/lights/src/lib/${dasherize(light)}`)
          ),
        ]),
        MergeStrategy.Overwrite
      );
    });

    const indexTemplate = mergeWith(
      apply(url('./files/index'), [
        applyTemplates({ lights, dasherize }),
        move(path.normalize(`./packages/core/lights/src`)),
      ]),
      MergeStrategy.Overwrite
    );

    return chain([...templates, indexTemplate]);
  };
}
