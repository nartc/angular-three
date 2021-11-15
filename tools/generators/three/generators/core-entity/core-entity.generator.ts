import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import {
  generateFiles,
  getWorkspaceLayout,
  logger,
  names,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';
import { CoreEntityTemplate } from '../../models/core-entity-template.enum';
import { catalogue } from './catalogue';

async function coreEntityGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const coreDir = join(libsDir, 'core');

  for (const [catalogueKey, catalogueItem] of Object.entries(catalogue)) {
    const catalogueIndex = [];
    logger.info(`Generating ${catalogueKey}...`);
    const catalogueDir = join(coreDir, catalogueKey);
    const isCatalogueExists = tree.exists(catalogueDir);

    if (!isCatalogueExists) {
      await librarySecondaryEntryPointGenerator(tree, {
        name: catalogueKey,
        library: 'core',
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
    }

    let extras = [];

    switch (catalogueKey) {
      case 'cameras':
        extras = ['cube-camera'];
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
}

export default coreEntityGenerator;
