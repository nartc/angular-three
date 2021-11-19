import {
  formatFiles,
  getProjects,
  ProjectConfiguration,
  readJson,
  Tree,
  updateJson,
  writeJson,
} from '@nrwl/devkit';
import { join } from 'path';

function removeUmdModuleIds(tree: Tree, ngPackageJsonPath: string) {
  updateJson(tree, ngPackageJsonPath, (json) => {
    if (json['lib']?.['umdModuleIds']) {
      delete json['lib']['umdModuleIds'];
    }
    return json;
  });
}

function cleanPackageJson(tree: Tree, packageJsonPath: string) {
  updateJson(tree, packageJsonPath, (json) => {
    if (json['ngPackage']) {
      delete json['ngPackage'];
    }
    return json;
  });
}

function moveNgPackageJson(
  tree: Tree,
  packageJsonPath: string,
  ngPackageJsonPath: string
) {
  const packageJson = readJson(tree, packageJsonPath);
  if (!packageJson['ngPackage']) return;

  writeJson(tree, ngPackageJsonPath, packageJson['ngPackage']);
}

function checkSecondaryEntryPoints(
  tree: Tree,
  projectConfiguration: ProjectConfiguration
) {
  const secondaryEntryDirs = tree
    .children(projectConfiguration.root)
    .filter((path) => {
      if (path === 'src' || tree.isFile(path)) return false;
      return tree.exists(join(projectConfiguration.root, path, 'package.json'));
    });

  console.log(secondaryEntryDirs);
}

export default async function (tree: Tree) {
  const projects = getProjects(tree);

  for (const projectConfiguration of Array.from(projects.values())) {
    const ngPackageJsonPath = `${projectConfiguration.root}/ng-package.json`;
    const packageJsonPath = `${projectConfiguration.root}/package.json`;

    const isNgPackageJsonExist = tree.exists(ngPackageJsonPath);

    // if (isNgPackageJsonExist) {
    //   removeUmdModuleIds(tree, ngPackageJsonPath);
    //   cleanPackageJson(tree, packageJsonPath);
    //   continue;
    // }
    //
    // const isPackageJsonExist = tree.exists(packageJsonPath);
    // if (!isPackageJsonExist) {
    //   continue;
    // }
    //
    // moveNgPackageJson(tree, packageJsonPath, ngPackageJsonPath);
    checkSecondaryEntryPoints(tree, projectConfiguration);
  }

  return () => {
    formatFiles(tree);
  };
}
