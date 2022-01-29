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

export const physicConstraints = [
  {
    name: 'PointToPoint',
    options: 'PointToPointConstraintOpts',
  },
  {
    name: 'ConeTwist',
    options: 'ConeTwistConstraintOpts',
  },
  {
    name: 'Distance',
    options: 'DistanceConstraintOpts',
  },
  {
    name: 'Hinge',
    options: 'HingeConstraintOpts',
  },
  {
    name: 'Lock',
    options: 'LockConstraintOpts',
  },
];

export default async function physicConstraintsGenerator(
  tree: Tree
): Promise<{ fileName: string; name: string }[]> {
  const { libsDir } = getWorkspaceLayout(tree);
  const physicConstraintsDir = join(libsDir, 'cannon', 'constraints');

  logger.log('Generating physic constraints...');

  if (!tree.exists(physicConstraintsDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'constraints',
      library: 'cannon',
      skipModule: true,
    });
  }

  const generatedPhysicConstraints = [];

  for (const physicConstraint of physicConstraints) {
    const normalizedNames = names(physicConstraint.name);

    generateFiles(
      tree,
      join(__dirname, 'files', 'lib'),
      join(physicConstraintsDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        options: physicConstraint.options,
        tmpl: '',
      }
    );

    generatedPhysicConstraints.push({
      name: normalizedNames.name,
      fileName: normalizedNames.fileName,
    });
  }

  generateFiles(
    tree,
    join(__dirname, 'files', 'index'),
    join(physicConstraintsDir, 'src'),
    {
      tmpl: '',
      items: generatedPhysicConstraints.map(({ fileName }) => fileName),
    }
  );

  await formatFiles(tree);

  return generatedPhysicConstraints;
}
