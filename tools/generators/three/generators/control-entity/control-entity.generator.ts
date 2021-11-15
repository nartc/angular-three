import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  logger,
  names,
  Tree,
} from '@nrwl/devkit';
import { updateJsonFile } from '@nrwl/workspace';
import { readdirSync } from 'fs';
import { join } from 'path';
import { controls } from '../../entities/controls';
import type { ControlEntity } from '../../models/control-collection.model';

function createControlFiles(
  tree: Tree,
  control: ControlEntity,
  normalizedNames: ReturnType<typeof names>,
  controlLibPath: string
) {
  generateFiles(
    tree,
    join(__dirname, 'files', 'lib'),
    join(controlLibPath, 'src', 'lib'),
    {
      ...normalizedNames,
      ...control,
      tmpl: '',
    }
  );
}

function createIndexFile(
  tree: Tree,
  control: ControlEntity,
  normalizedNames: ReturnType<typeof names>,
  controlLibPath: string
) {
  generateFiles(
    tree,
    join(__dirname, 'files', 'index'),
    join(controlLibPath, 'src'),
    {
      ...normalizedNames,
      ...control,
      tmpl: '',
    }
  );
}

function createPackageJsonFile(
  tree: Tree,
  control: ControlEntity,
  normalizedNames: ReturnType<typeof names>,
  controlLibPath: string
) {
  generateFiles(
    tree,
    join(__dirname, 'files', 'packageJson'),
    join(controlLibPath),
    {
      ...normalizedNames,
      ...control,
      tmpl: '',
    }
  );
}

function createFiles(
  tree: Tree,
  control: ControlEntity,
  normalizedNames: ReturnType<typeof names>,
  controlLibPath: string
) {
  createControlFiles(tree, control, normalizedNames, controlLibPath);
  createIndexFile(tree, control, normalizedNames, controlLibPath);
  createPackageJsonFile(tree, control, normalizedNames, controlLibPath);
}

async function controlEntityGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const controlsDir = join(libsDir, 'controls');
  const currentEntityDirs = new Map(
    readdirSync(controlsDir, { withFileTypes: true })
      .filter((dir) => dir.isDirectory() && dir.name !== 'src')
      .map((dir) => [
        dir.name,
        {
          isChecked: false,
          fullPath: join(controlsDir, dir.name),
          name: dir.name,
        },
      ])
  );

  for (const control of controls) {
    const normalizedNames = names(control.name);

    logger.info(`Generating control ${normalizedNames.className}...`);

    const entityLibDir = currentEntityDirs.get(normalizedNames.fileName);

    if (!!entityLibDir) {
      currentEntityDirs.set(normalizedNames.fileName, {
        ...entityLibDir,
        isChecked: true,
      });
      createFiles(tree, control, normalizedNames, entityLibDir.fullPath);
    } else {
      await librarySecondaryEntryPointGenerator(tree, {
        name: normalizedNames.fileName,
        library: 'controls',
      });
      createFiles(
        tree,
        control,
        normalizedNames,
        join(controlsDir, normalizedNames.fileName)
      );
    }

    logger.info(`Generated control ${normalizedNames.className}`);
  }

  currentEntityDirs.forEach((entityLibDir) => {
    if (!entityLibDir.isChecked) {
      tree.delete(entityLibDir.fullPath);
      updateJsonFile('tsconfig.base.json', (json) => {
        if (json.paths[`@angular-three/controls/${entityLibDir.name}`]) {
          delete json.paths[`@angular-three/controls/${entityLibDir.name}`];
        }
        return json;
      });

      updateJsonFile(join(controlsDir, 'project.json'), (json) => {
        if (json.target?.lint?.options?.lintFilePatterns) {
          json.target.lint.options.lintFilePatterns =
            json.target.lint.options.lintFilePatterns.filter(
              (pattern) =>
                !pattern.startWith(`packages/controls/${entityLibDir.name}`)
            );
        }

        return json;
      });
    }
  });

  return async () => {
    await formatFiles(tree);
  };
}

export default controlEntityGenerator;
