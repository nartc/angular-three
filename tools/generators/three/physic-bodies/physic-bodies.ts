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

export const physicBodies = [
    {
        name: 'Box',
        props: 'BoxProps',
        argsFn: {
            withArgs: true,
            defaultArgs: '[1, 1, 1]',
            body: 'args',
        },
        utilImports: [],
    },
    {
        name: 'Plane',
        props: 'PlaneProps',
        argsFn: {
            withArgs: false,
            defaultArgs: '',
            body: '[]',
        },
        utilImports: [],
    },
    {
        name: 'Cylinder',
        props: 'CylinderProps',
        argsFn: {
            withArgs: true,
            defaultArgs: '[]',
            body: 'args',
        },
        utilImports: [],
    },
    {
        name: 'Heightfield',
        props: 'HeightfieldProps',
        utilImports: [],
    },
    {
        name: 'Particle',
        props: 'ParticleProps',
        argsFn: {
            withArgs: false,
            defaultArgs: '',
            body: '[]',
        },
        utilImports: [],
    },
    {
        name: 'Sphere',
        props: 'SphereProps',
        argsFn: {
            withArgs: true,
            defaultArgs: '[1]',
            body: `{
  if (!Array.isArray(args)) throw new Error('ngtPhysicSphere args must be an array');
  return [args[0]];
}`,
        },
        utilImports: [],
    },
    {
        name: 'Trimesh',
        props: 'TrimeshProps',
        utilImports: [],
    },
    {
        name: 'ConvexPolyhedron',
        props: 'ConvexPolyhedronProps',
        argsFn: {
            withArgs: true,
            defaultArgs: '[]',
            body: `{
  return [
    args[0] ? args[0].map(makeTriplet) : undefined,
    args[1],
    args[2] ? args[2].map(makeTriplet) : undefined,
    args[3] ? args[3].map(makeTriplet) : undefined,
    args[4],
  ];
}`,
        },
        utilImports: ['makeTriplet'],
    },
    {
        name: 'Compound',
        props: 'CompoundBodyProps',
        utilImports: [],
    },
];

export default async function physicBodiesGenerator(
    tree: Tree
): Promise<{ name: string; fileName: string }[]> {
    const { libsDir } = getWorkspaceLayout(tree);
    const physicBodiesDir = join(libsDir, 'cannon', 'bodies');

    logger.log('Generating physic bodies...');

    if (!tree.exists(physicBodiesDir)) {
        await librarySecondaryEntryPointGenerator(tree, {
            name: 'bodies',
            library: 'cannon',
            skipModule: true,
        });
    }

    const generatedPhysicBodies = [];

    for (const physicBody of physicBodies) {
        const normalizedNames = names(physicBody.name);

        generateFiles(
            tree,
            join(__dirname, 'files', 'lib'),
            join(physicBodiesDir, 'src', 'lib', normalizedNames.fileName),
            {
                ...physicBody,
                argsFn: physicBody.argsFn || undefined,
                ...normalizedNames,
                tmpl: '',
            }
        );

        generatedPhysicBodies.push({
            name: normalizedNames.name,
            fileName: normalizedNames.fileName,
        });
    }

    generateFiles(
        tree,
        join(__dirname, 'files', 'index'),
        join(physicBodiesDir, 'src'),
        {
            tmpl: '',
            items: generatedPhysicBodies.map(({ fileName }) => fileName),
        }
    );

    await formatFiles(tree);

    return generatedPhysicBodies;
}
