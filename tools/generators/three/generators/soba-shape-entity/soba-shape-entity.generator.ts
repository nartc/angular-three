import { generateFiles, getWorkspaceLayout, names, Tree } from '@nrwl/devkit';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { sobaShapes } from '../../entities/soba-shapes';

async function sobaShapeEntityGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const sobaDir = join(libsDir, 'soba');
  const shapesDir = join(sobaDir, 'shapes');

  const sobaShapesIndex = [];

  for (const sobaShape of sobaShapes) {
    const normalizedNames = names(sobaShape.name);
    const normalizedGeometryNames = names(sobaShape.geometry);
    const sobaShapeDir = join(
      shapesDir,
      'src',
      'lib',
      normalizedNames.fileName
    );

    const isSobaShapeDirExist = tree.exists(sobaShapeDir);

    if (!isSobaShapeDirExist) {
      mkdirSync(sobaShapeDir);
    }

    generateFiles(tree, join(__dirname, 'files', 'lib'), sobaShapeDir, {
      ...normalizedNames,
      tmpl: '',
      geometryClassName: normalizedGeometryNames.className,
      geometryFileName: normalizedGeometryNames.fileName,
    });

    sobaShapesIndex.push(normalizedNames.fileName);
  }

  generateFiles(
    tree,
    join(__dirname, 'files', 'index'),
    join(shapesDir, 'src'),
    {
      tmpl: '',
      items: sobaShapesIndex,
    }
  );

  generateFiles(
    tree,
    join(__dirname, 'files', 'selectors'),
    join(__dirname, '../', 'object-3d'),
    {
      tmpl: '',
      selectors: sobaShapesIndex.map((fileName) => `ngt-soba-${fileName}`),
    }
  );
}

export default sobaShapeEntityGenerator;
