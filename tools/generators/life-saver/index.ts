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
import { classify, dasherize } from '@nrwl/workspace/src/utils/strings';
import * as path from 'path';
import { catalogue } from './catalogue';
import { controls } from './entities/controls';
import { passes } from './entities/passes';
import { Template } from './models/template.enum';

export default function (): Rule {
  return (tree, context) => {
    const derivedObject3Ds = [];
    const templates = [];
    const controlTemplates = [];
    const passTemplates = [];

    for (const [
      key,
      { items, abstract, type, withThreeObject3d, templateType },
    ] of Object.entries(catalogue)) {
      context.logger.info(`Generating THREE ${classify(key)}`);
      let fileDir = 'with-no-args-no-parameters';

      switch (templateType) {
        case Template.WithParams:
          fileDir = 'with-parameters';
          break;
        case Template.WithArgs:
          fileDir = 'with-args';
          break;
      }

      const keyTemplates = items.map((item) => {
        const dasherizedItem = dasherize(item);
        if (withThreeObject3d) {
          derivedObject3Ds.push(`ngt-${dasherizedItem}`);
        }
        return objectLibTemplate(
          fileDir,
          item,
          withThreeObject3d,
          abstract,
          type,
          key,
          dasherizedItem
        );
      });

      let extras = [];

      switch (key) {
        case 'attributes':
          extras = ['interleaved-buffer-attribute'];
          break;
        case 'cameras':
          extras = ['cube-camera'];
          break;
      }

      templates.push(...keyTemplates, mainIndexTemplate(items, extras, key));
    }

    context.logger.info('Generating Object3dController');
    templates.push(object3dControllerTemplate(derivedObject3Ds));

    for (const {
      name,
      importThree,
      useRenderer,
      constructor,
      injectDocument,
      inputs,
    } of controls) {
      context.logger.info(`Generating ${name}`);

      controlTemplates.push(
        controlTemplate(name, constructor, injectDocument, useRenderer, inputs),
        controlIndexTemplate(name),
        controlConfigTemplate(name, importThree)
      );
    }

    for (const {
      name,
      passImports,
      useSceneAndCamera,
      threeImports,
      threeCoreImports,
      inputs,
      importPass,
      importReflector,
    } of passes) {
      context.logger.info(`Generating ${name}`);

      passTemplates.push(
        passTemplate(
          name,
          threeCoreImports,
          threeImports,
          passImports,
          inputs,
          useSceneAndCamera,
          importPass,
          importReflector
        ),
        passIndexTemplate(name),
        passConfigTemplate(name)
      );
    }

    return chain([
      chain(templates),
      chain(controlTemplates),
      chain(passTemplates),
    ]);
  };
}

function mainIndexTemplate(
  items: string[],
  extras: string[],
  key: string
): Rule {
  return mergeWith(
    apply(url('./files/main'), [
      applyTemplates({ items, extras, dasherize }),
      move(path.normalize(`./packages/core/${key}/src`)),
    ]),
    MergeStrategy.Overwrite
  );
}

function objectLibTemplate(
  fileDir: string,
  item: string,
  withThreeObject3d: boolean,
  abstract: string,
  type: string,
  key: string,
  dasherizedItem: string
): Rule {
  return mergeWith(
    apply(url(`./files/${fileDir}`), [
      applyTemplates({
        name: item,
        alternative:
          item !== 'BufferGeometry' && item.includes('BufferGeometry')
            ? item.replace('Buffer', '')
            : '',
        withThreeObject3d,
        abstract,
        type,
        dasherize,
      }),
      move(path.normalize(`./packages/core/${key}/src/lib/${dasherizedItem}`)),
    ]),
    MergeStrategy.Overwrite
  );
}

function object3dControllerTemplate(derivedObject3Ds: string[]): Rule {
  return mergeWith(
    apply(url('./files/object-3d-controller'), [
      applyTemplates({
        selectors: derivedObject3Ds.map((selector, index) => ({
          selector,
          isLast: index === derivedObject3Ds.length - 1,
        })),
      }),
      move(path.normalize('./packages/core/src/lib/controllers')),
    ]),
    MergeStrategy.Overwrite
  );
}

function controlTemplate(
  name: string,
  constructor: string,
  injectDocument: boolean,
  useRenderer: boolean,
  inputs: {
    default: string;
    import: string;
    name: string;
    isArray: boolean;
    isOptional: boolean;
  }[]
): Rule {
  return mergeWith(
    apply(url('./files/controls/lib'), [
      applyTemplates({
        name,
        constructor,
        injectDocument,
        useRenderer,
        inputs,
        dasherize,
      }),
      move(path.normalize(`./packages/controls/${dasherize(name)}/src/lib`)),
    ]),
    MergeStrategy.Overwrite
  );
}

function controlIndexTemplate(name: string): Rule {
  return mergeWith(
    apply(url('./files/controls/index'), [
      applyTemplates({ name, dasherize }),
      move(path.normalize(`./packages/controls/${dasherize(name)}/src`)),
    ]),
    MergeStrategy.Overwrite
  );
}

function controlConfigTemplate(name: string, importThree: boolean): Rule {
  return mergeWith(
    apply(url('./files/controls/ng-package'), [
      applyTemplates({ name, dasherize, importThree }),
      move(path.normalize(`./packages/controls/${dasherize(name)}`)),
    ]),
    MergeStrategy.Overwrite
  );
}

function passTemplate(
  name: string,
  threeCoreImports: string[],
  threeImports: string[],
  passImports: string[],
  inputs: {
    import: string;
    name: string;
    isArray: boolean;
  }[],
  sceneAndCamera: 'scene' | 'camera' | 'sceneAndCamera' | null,
  importPass: boolean,
  importReflector: boolean
): Rule {
  return mergeWith(
    apply(url('./files/passes/lib'), [
      applyTemplates({
        name,
        threeCoreImports,
        threeImports,
        passImports,
        inputs,
        sceneAndCamera,
        importPass,
        importReflector,
        dasherize,
      }),
      move(
        path.normalize(`./packages/postprocessing/${dasherize(name)}/src/lib`)
      ),
    ]),
    MergeStrategy.Overwrite
  );
}

function passIndexTemplate(name: string): Rule {
  return mergeWith(
    apply(url('./files/passes/index'), [
      applyTemplates({ name, dasherize }),
      move(path.normalize(`./packages/postprocessing/${dasherize(name)}/src`)),
    ]),
    MergeStrategy.Overwrite
  );
}

function passConfigTemplate(name: string): Rule {
  return mergeWith(
    apply(url('./files/passes/ng-package'), [
      applyTemplates({ name, dasherize, importThree: true }),
      move(path.normalize(`./packages/postprocessing/${dasherize(name)}`)),
    ]),
    MergeStrategy.Overwrite
  );
}
