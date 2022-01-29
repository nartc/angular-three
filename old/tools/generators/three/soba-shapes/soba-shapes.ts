import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import {
  generateFiles,
  getWorkspaceLayout,
  logger,
  names,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';

export const sobaShapes = [
  {
    name: 'plane',
    geometry: 'plane-geometry',
  },
  {
    name: 'box',
    geometry: 'box-geometry',
  },
  {
    name: 'cylinder',
    geometry: 'cylinder-geometry',
  },
  {
    name: 'cone',
    geometry: 'cone-geometry',
  },
  {
    name: 'circle',
    geometry: 'circle-geometry',
  },
  {
    name: 'sphere',
    geometry: 'sphere-geometry',
  },
  {
    name: 'tube',
    geometry: 'tube-geometry',
  },
  {
    name: 'torus',
    geometry: 'torus-geometry',
  },
  {
    name: 'tetrahedron',
    geometry: 'tetrahedron-geometry',
  },
  {
    name: 'ring',
    geometry: 'ring-geometry',
  },
  {
    name: 'polyhedron',
    geometry: 'polyhedron-geometry',
  },
  {
    name: 'octahedron',
    geometry: 'octahedron-geometry',
  },
  {
    name: 'dodecahedron',
    geometry: 'dodecahedron-geometry',
  },
  {
    name: 'icosahedron',
    geometry: 'icosahedron-geometry',
  },
  {
    name: 'extrude',
    geometry: 'extrude-geometry',
  },
  {
    name: 'lathe',
    geometry: 'lathe-geometry',
  },
  // TODO: skip until three-std and three are aligned
  // {
  //   name: 'parametric',
  //   geometry: 'parametric-geometry',
  //   isExample: true,
  // },
  {
    name: 'torusKnot',
    geometry: 'torus-knot-geometry',
  },
];

export default async function sobaShapesGenerator(
  tree: Tree
): Promise<string[]> {
  const { libsDir } = getWorkspaceLayout(tree);
  const sobaShapesDir = join(libsDir, 'soba', 'shapes');

  logger.log('Generating Soba shapes...');

  if (!tree.exists(sobaShapesDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'shapes',
      library: 'soba',
      skipModule: true,
    });
  }

  const generatedSobaShapes = [];
  for (const sobaShape of sobaShapes) {
    const {
      name: shapeName,
      fileName: shapeFileName,
      propertyName: shapePropertyName,
      constantName: shapeConstantName,
      className: shapeClassName,
    } = names(sobaShape.name);
    const shapeNames = {
      shapeName,
      shapeFileName,
      shapePropertyName,
      shapeConstantName,
      shapeClassName,
    };

    const {
      name: geometryName,
      fileName: geometryFileName,
      propertyName: geometryPropertyName,
      constantName: geometryConstantName,
      className: geometryClassName,
    } = names(sobaShape.geometry);
    const geometryNames = {
      geometryName,
      geometryFileName,
      geometryPropertyName,
      geometryConstantName,
      geometryClassName,
    };

    generateFiles(
      tree,
      join(__dirname, 'files', 'lib'),
      join(sobaShapesDir, 'src', 'lib', shapeNames.shapeFileName),
      {
        ...shapeNames,
        ...geometryNames,
        tmpl: '',
      }
    );

    generatedSobaShapes.push(shapeNames.shapeFileName);
  }

  generateFiles(
    tree,
    join(__dirname, 'files', 'index'),
    join(sobaShapesDir, 'src'),
    {
      tmpl: '',
      items: generatedSobaShapes,
    }
  );

  return generatedSobaShapes;
}
