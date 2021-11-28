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
import { Entity } from '../../models/entity-collection.model';
import object3dGenerator from '../object-3d/object-3d.generator';
import { catalogue } from './catalogue';

function getTemplateAdditionalProps(
  isExample: boolean,
  catalogueKey: string,
  normalizedNames: ReturnType<typeof names>,
  abstractGenerics?: Entity['abstractGenerics']
) {
  if (isExample) {
    let mainGeneric = abstractGenerics
      ? abstractGenerics.main
      : normalizedNames.name;
    let argsName = normalizedNames.name;
    let typeName = normalizedNames.name;
    const paramsName = normalizedNames.name;
    if (catalogueKey === 'curves') {
      if (normalizedNames.name === 'NURBSCurve') {
        argsName = normalizedNames.name;
        typeName = normalizedNames.name;
      } else {
        argsName = `Curves.${normalizedNames.name}`;
        typeName = `Curves.${normalizedNames.name}`;
        mainGeneric = `Curves.${mainGeneric}`;
      }
    }

    return {
      argsName,
      typeName,
      paramsName,
      mainGeneric,
      secondaryGeneric: abstractGenerics
        ? abstractGenerics.secondary
        : undefined,
    };
  }

  const threeName = `THREE.${normalizedNames.name}`;

  return {
    argsName: threeName,
    paramsName:
      normalizedNames.name === 'RawShaderMaterial'
        ? 'THREE.ShaderMaterial'
        : threeName,
    typeName: threeName,
    mainGeneric: abstractGenerics
      ? `THREE.${abstractGenerics.main}`
      : `THREE.${normalizedNames.name}`,
    secondaryGeneric: abstractGenerics
      ? normalizedNames.name.includes('Audio')
        ? abstractGenerics.secondary
        : `THREE.${abstractGenerics.secondary}`
      : undefined,
  };
}

function removeModuleFile(
  tree: Tree,
  catalogueDir: string,
  normalizedNames: ReturnType<typeof names>
) {
  if (
    tree.exists(
      join(
        catalogueDir,
        'src',
        'lib',
        normalizedNames.fileName,
        `${normalizedNames.fileName}.module.ts`
      )
    )
  ) {
    tree.delete(
      join(
        catalogueDir,
        'src',
        'lib',
        normalizedNames.fileName,
        `${normalizedNames.fileName}.module.ts`
      )
    );
  }
}

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

    for (const { name, abstractGenerics } of catalogueItem.items) {
      const _catalogueKey = catalogueItem.from[name] || catalogueKey;
      const normalizedNames = names(name);
      generateFiles(
        tree,
        join(__dirname, 'files', 'lib'),
        join(catalogueDir, 'src', 'lib', normalizedNames.fileName),
        {
          ...normalizedNames,
          ...catalogueItem,
          catalogueKey: _catalogueKey,
          isExample: false,
          withParameters,
          withArgs,
          tmpl: '',
          ...getTemplateAdditionalProps(
            false,
            _catalogueKey,
            normalizedNames,
            abstractGenerics
          ),
        }
      );

      catalogueIndex.push(normalizedNames.fileName);
      if (catalogueItem.withThreeObject3d) {
        derivedObject3Ds.push(normalizedNames.fileName);
      }

      removeModuleFile(tree, catalogueDir, normalizedNames);
    }

    for (const { name, abstractGenerics } of catalogueItem.examples) {
      const normalizedNames = names(name);
      const _catalogueKey = catalogueItem.from[name] || catalogueKey;
      generateFiles(
        tree,
        join(__dirname, 'files', 'lib'),
        join(catalogueDir, 'src', 'lib', normalizedNames.fileName),
        {
          ...normalizedNames,
          ...catalogueItem,
          catalogueKey: catalogueItem.from[name] || catalogueKey,
          isExample: true,
          withParameters,
          withArgs,
          tmpl: '',
          ...getTemplateAdditionalProps(
            true,
            _catalogueKey,
            normalizedNames,
            abstractGenerics
          ),
        }
      );

      catalogueIndex.push(normalizedNames.fileName);
      examplesIndex.push({
        catalogue: catalogueItem.from[name] || catalogueKey,
        name,
      });
      if (catalogueItem.withThreeObject3d) {
        derivedObject3Ds.push(normalizedNames.fileName);
      }

      removeModuleFile(tree, catalogueDir, normalizedNames);
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
      case 'audios':
        extras = ['audio-listener'];
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
