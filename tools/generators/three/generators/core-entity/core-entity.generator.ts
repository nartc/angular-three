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
import { CoreEntityTemplate } from '../../models/core-entity-template.enum';
import object3dGenerator from '../object-3d/object-3d.generator';
import { catalogue } from './catalogue';

async function coreEntityGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const coreDir = join(libsDir, 'core');
  const derivedObject3Ds = [];

  for (const [catalogueKey, catalogueItem] of Object.entries(catalogue)) {
    const catalogueIndex = [];
    const examplesIndex = [];
    logger.info(`Generating ${catalogueKey}...`);
    const catalogueDir = join(coreDir, catalogueKey);
    const isCatalogueExists = tree.exists(catalogueDir);

    if (!isCatalogueExists) {
      await librarySecondaryEntryPointGenerator(tree, {
        name: catalogueKey,
        library: 'core',
        skipModule: true,
      });
    }

    const withParameters =
      catalogueItem.templateType === CoreEntityTemplate.WithParams;
    const withArgs = catalogueItem.templateType === CoreEntityTemplate.WithArgs;

    for (const item of catalogueItem.items) {
      const normalizedNames = names(item);
      generateFiles(
        tree,
        join(__dirname, 'files', 'lib'),
        join(catalogueDir, 'src', 'lib', normalizedNames.fileName),
        {
          ...normalizedNames,
          ...catalogueItem,
          catalogueKey: catalogueItem.from[item] || catalogueKey,
          isExample: false,
          withParameters,
          withArgs,
          tmpl: '',
        }
      );

      catalogueIndex.push(normalizedNames.fileName);
      if (catalogueItem.withThreeObject3d) {
        derivedObject3Ds.push(normalizedNames.fileName);
      }
    }

    for (const example of catalogueItem.examples) {
      const normalizedNames = names(example);
      generateFiles(
        tree,
        join(__dirname, 'files', 'lib'),
        join(catalogueDir, 'src', 'lib', normalizedNames.fileName),
        {
          ...normalizedNames,
          ...catalogueItem,
          catalogueKey: catalogueItem.from[example] || catalogueKey,
          isExample: true,
          withParameters,
          withArgs,
          tmpl: '',
        }
      );

      catalogueIndex.push(normalizedNames.fileName);
      examplesIndex.push({
        catalogue: catalogueItem.from[example] || catalogueKey,
        name: example,
      });
      if (catalogueItem.withThreeObject3d) {
        derivedObject3Ds.push(normalizedNames.fileName);
      }
    }

    let extras = [];

    switch (catalogueKey) {
      case 'cameras':
        extras = ['cube-camera'];
        break;
      case 'curves':
        if (catalogueItem.examples.length) {
          examplesIndex.push({
            catalogue: catalogueKey,
            name: 'CurveExtras',
          });
        }
        break;
    }

    generateFiles(
      tree,
      join(__dirname, 'files', 'index'),
      join(catalogueDir, 'src'),
      {
        extras,
        items: catalogueIndex,
        tmpl: '',
      }
    );
  }

  logger.info('Generating derived object3Ds...');
  await object3dGenerator(tree, derivedObject3Ds);

  return async () => {
    await formatFiles(tree);
  };
}

export default coreEntityGenerator;
