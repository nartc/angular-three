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
import { passes } from '../../entities/passes';
import { PassEntity } from '../../models/pass-collection.model';

function createPassFiles(
  tree: Tree,
  pass: PassEntity,
  normalizedNames: ReturnType<typeof names>,
  passLibPath: string
) {
  generateFiles(
    tree,
    join(__dirname, 'files', 'lib'),
    join(passLibPath, 'src', 'lib'),
    {
      ...normalizedNames,
      ...pass,
      sceneAndCamera: pass.useSceneAndCamera,
      importFsQuad: pass.importFsQuad || false,
      importReflector: pass.importReflector || false,
      tmpl: '',
    }
  );
}

function createIndexFile(
  tree: Tree,
  pass: PassEntity,
  normalizedNames: ReturnType<typeof names>,
  passLibPath: string
) {
  generateFiles(
    tree,
    join(__dirname, 'files', 'index'),
    join(passLibPath, 'src'),
    {
      ...normalizedNames,
      ...pass,
      tmpl: '',
    }
  );
}

function createPackageJsonFile(
  tree: Tree,
  pass: PassEntity,
  normalizedNames: ReturnType<typeof names>,
  passLibPath: string
) {
  generateFiles(
    tree,
    join(__dirname, 'files', 'packageJson'),
    join(passLibPath),
    {
      ...normalizedNames,
      ...pass,
      tmpl: '',
    }
  );
}

function createFiles(
  tree: Tree,
  pass: PassEntity,
  normalizedNames: ReturnType<typeof names>,
  passLibPath: string
) {
  createPassFiles(tree, pass, normalizedNames, passLibPath);
  createIndexFile(tree, pass, normalizedNames, passLibPath);
  createPackageJsonFile(tree, pass, normalizedNames, passLibPath);
}

async function passEntityGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const postProcessingDir = join(libsDir, 'postprocessing');
  const currentEntityDirs = new Map(
    readdirSync(postProcessingDir, { withFileTypes: true })
      .filter((dir) => dir.isDirectory() && dir.name !== 'src')
      .map((dir) => [
        dir.name,
        {
          isChecked: false,
          fullPath: join(postProcessingDir, dir.name),
          name: dir.name,
        },
      ])
  );

  for (const pass of passes) {
    const normalizedNames = names(pass.name);

    logger.info(`Generating pass ${normalizedNames.className}...`);

    const entityLibDir = currentEntityDirs.get(normalizedNames.fileName);

    if (!!entityLibDir) {
      currentEntityDirs.set(normalizedNames.fileName, {
        ...entityLibDir,
        isChecked: true,
      });
      createFiles(tree, pass, normalizedNames, entityLibDir.fullPath);
    } else {
      await librarySecondaryEntryPointGenerator(tree, {
        name: normalizedNames.fileName,
        library: 'postprocessing',
      });
      createFiles(
        tree,
        pass,
        normalizedNames,
        join(postProcessingDir, normalizedNames.fileName)
      );
    }
  }

  currentEntityDirs.forEach((entityLibDir) => {
    if (!entityLibDir.isChecked) {
      tree.delete(entityLibDir.fullPath);
      updateJsonFile('tsconfig.base.json', (json) => {
        if (json.paths[`@angular-three/postprocessing/${entityLibDir.name}`]) {
          delete json.paths[
            `@angular-three/postprocessing/${entityLibDir.name}`
          ];
        }
        return json;
      });

      updateJsonFile(join(postProcessingDir, 'project.json'), (json) => {
        if (json.target?.lint?.options?.lintFilePatterns) {
          json.target.lint.options.lintFilePatterns =
            json.target.lint.options.lintFilePatterns.filter(
              (pattern) =>
                !pattern.startWith(
                  `packages/postprocessing/${entityLibDir.name}`
                )
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

export default passEntityGenerator;
