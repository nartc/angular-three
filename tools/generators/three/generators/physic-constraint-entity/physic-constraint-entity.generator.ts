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
import { physicConstraints } from '../../entities/physic-constraints';
import { PhysicConstraintEntity } from '../../models/physic-constraint-collection.model';

function createPhysicConstraintFiles(
  tree: Tree,
  physicConstraint: PhysicConstraintEntity,
  normalizedNames: ReturnType<typeof names>,
  cannonLibPath: string
) {
  generateFiles(
    tree,
    join(__dirname, 'files', 'lib'),
    join(cannonLibPath, 'src', 'lib'),
    {
      ...normalizedNames,
      ...physicConstraint,
      tmpl: '',
    }
  );
}

function createIndexFile(
  tree: Tree,
  physicConstraint: PhysicConstraintEntity,
  normalizedNames: ReturnType<typeof names>,
  cannonLibPath: string
) {
  generateFiles(
    tree,
    join(__dirname, 'files', 'index'),
    join(cannonLibPath, 'src'),
    {
      ...normalizedNames,
      ...physicConstraint,
      tmpl: '',
    }
  );
}

function createPackageJsonFile(
  tree: Tree,
  physicConstraint: PhysicConstraintEntity,
  normalizedNames: ReturnType<typeof names>,
  cannonLibPath: string
) {
  generateFiles(
    tree,
    join(__dirname, 'files', 'packageJson'),
    join(cannonLibPath),
    {
      ...normalizedNames,
      ...physicConstraint,
      tmpl: '',
    }
  );
}

function createFiles(
  tree: Tree,
  physicConstraint: PhysicConstraintEntity,
  normalizedNames: ReturnType<typeof names>,
  cannonLibPath: string
) {
  createPhysicConstraintFiles(
    tree,
    physicConstraint,
    normalizedNames,
    cannonLibPath
  );
  createIndexFile(tree, physicConstraint, normalizedNames, cannonLibPath);
  createPackageJsonFile(tree, physicConstraint, normalizedNames, cannonLibPath);
}

async function physicConstraintEntityGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const cannonDir = join(libsDir, 'cannon');
  const currentEntityDirs = new Map(
    readdirSync(cannonDir, { withFileTypes: true })
      .filter(
        (dir) =>
          dir.isDirectory() &&
          dir.name !== 'src' &&
          dir.name.endsWith('constraint')
      )
      .map((dir) => [
        dir.name,
        {
          isChecked: false,
          fullPath: join(cannonDir, dir.name),
          name: dir.name + '-constraint',
        },
      ])
  );

  for (const physicConstraint of physicConstraints) {
    const normalizedNames = names(physicConstraint.name);

    logger.info(`Generating physic constraint ${normalizedNames.className}...`);

    const entityLibDir = currentEntityDirs.get(normalizedNames.fileName);

    if (!!entityLibDir) {
      currentEntityDirs.set(normalizedNames.fileName, {
        ...entityLibDir,
        isChecked: true,
      });
      createFiles(
        tree,
        physicConstraint,
        normalizedNames,
        entityLibDir.fullPath
      );
    } else {
      await librarySecondaryEntryPointGenerator(tree, {
        name: normalizedNames.fileName + '-constraint',
        library: 'cannon',
      });
      createFiles(
        tree,
        physicConstraint,
        normalizedNames,
        join(cannonDir, normalizedNames.fileName + '-constraint')
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

export default physicConstraintEntityGenerator;
