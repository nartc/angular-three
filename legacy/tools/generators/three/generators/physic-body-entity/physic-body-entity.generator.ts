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
import { physicBodies } from '../../entities/physic-bodies';
import { PhysicBodyEntity } from '../../models/physic-body-collection.model';

function createPhysicBodyFiles(
  tree: Tree,
  physicBody: PhysicBodyEntity,
  normalizedNames: ReturnType<typeof names>,
  cannonLibPath: string
) {
  generateFiles(
    tree,
    join(__dirname, 'files', 'lib'),
    join(cannonLibPath, 'src', 'lib'),
    {
      ...normalizedNames,
      ...physicBody,
      tmpl: '',
    }
  );
}

function createIndexFile(
  tree: Tree,
  physicBody: PhysicBodyEntity,
  normalizedNames: ReturnType<typeof names>,
  cannonLibPath: string
) {
  generateFiles(
    tree,
    join(__dirname, 'files', 'index'),
    join(cannonLibPath, 'src'),
    {
      ...normalizedNames,
      ...physicBody,
      tmpl: '',
    }
  );
}

function createFiles(
  tree: Tree,
  physicBody: PhysicBodyEntity,
  normalizedNames: ReturnType<typeof names>,
  cannonLibPath: string
) {
  createPhysicBodyFiles(tree, physicBody, normalizedNames, cannonLibPath);
  createIndexFile(tree, physicBody, normalizedNames, cannonLibPath);
}

async function physicBodyEntityGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const cannonDir = join(libsDir, 'cannon');
  const currentEntityDirs = new Map(
    readdirSync(cannonDir, { withFileTypes: true })
      .filter(
        (dir) =>
          dir.isDirectory() &&
          dir.name !== 'src' &&
          !dir.name.endsWith('constraint')
      )
      .map((dir) => [
        dir.name,
        {
          isChecked: false,
          fullPath: join(cannonDir, dir.name),
          name: dir.name,
        },
      ])
  );

  for (const physicBody of physicBodies) {
    const normalizedNames = names(physicBody.name);

    logger.info(`Generating physic body ${normalizedNames.className}...`);

    const entityLibDir = currentEntityDirs.get(normalizedNames.fileName);

    if (!!entityLibDir) {
      currentEntityDirs.set(normalizedNames.fileName, {
        ...entityLibDir,
        isChecked: true,
      });
      createFiles(tree, physicBody, normalizedNames, entityLibDir.fullPath);
    } else {
      await librarySecondaryEntryPointGenerator(tree, {
        name: normalizedNames.fileName,
        library: 'cannon',
      });
      createFiles(
        tree,
        physicBody,
        normalizedNames,
        join(cannonDir, normalizedNames.fileName)
      );
    }
  }

  currentEntityDirs.forEach((entityLibDir) => {
    if (!entityLibDir.isChecked) {
      tree.delete(entityLibDir.fullPath);
      updateJsonFile('tsconfig.base.json', (json) => {
        if (json.paths?.[`@angular-three/cannon/${entityLibDir.name}`]) {
          delete json.paths[`@angular-three/cannon/${entityLibDir.name}`];
        }
        return json;
      });

      updateJsonFile(join(cannonDir, 'project.json'), (json) => {
        if (json.target?.lint?.options?.lintFilePatterns) {
          json.target.lint.options.lintFilePatterns =
            json.target.lint.options.lintFilePatterns.filter(
              (pattern) =>
                !pattern.startWith(`packages/cannon/${entityLibDir.name}`)
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

export default physicBodyEntityGenerator;
