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
import * as THREE from 'three';

const materials = [
    {
        name: THREE.ShadowMaterial.name,
        parameters: 'ShadowMaterialParameters',
        defPath: 'node_modules/@types/three/src/materials/ShadowMaterial.d.ts',
    },
    {
        name: THREE.SpriteMaterial.name,
        parameters: 'SpriteMaterialParameters',
        defPath: 'node_modules/@types/three/src/materials/SpriteMaterial.d.ts',
    },
    {
        name: THREE.RawShaderMaterial.name,
        parameters: 'ShaderMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/RawShaderMaterial.d.ts',
    },
    {
        name: THREE.ShaderMaterial.name,
        parameters: 'ShaderMaterialParameters',
        defPath: 'node_modules/@types/three/src/materials/ShaderMaterial.d.ts',
    },
    {
        name: THREE.PointsMaterial.name,
        parameters: 'PointsMaterialParameters',
        defPath: 'node_modules/@types/three/src/materials/PointsMaterial.d.ts',
    },
    {
        name: THREE.MeshPhysicalMaterial.name,
        parameters: 'MeshPhysicalMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshPhysicalMaterial.d.ts',
    },
    {
        name: THREE.MeshStandardMaterial.name,
        parameters: 'MeshStandardMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshStandardMaterial.d.ts',
    },
    {
        name: THREE.MeshPhongMaterial.name,
        parameters: 'MeshPhongMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshPhongMaterial.d.ts',
    },
    {
        name: THREE.MeshToonMaterial.name,
        parameters: 'MeshToonMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshToonMaterial.d.ts',
    },
    {
        name: THREE.MeshNormalMaterial.name,
        parameters: 'MeshNormalMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshNormalMaterial.d.ts',
    },
    {
        name: THREE.MeshLambertMaterial.name,
        parameters: 'MeshLambertMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshLambertMaterial.d.ts',
    },
    {
        name: THREE.MeshDepthMaterial.name,
        parameters: 'MeshDepthMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshDepthMaterial.d.ts',
    },
    {
        name: THREE.MeshDistanceMaterial.name,
        parameters: 'MeshDistanceMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshDistanceMaterial.d.ts',
    },
    {
        name: THREE.MeshBasicMaterial.name,
        parameters: 'MeshBasicMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshBasicMaterial.d.ts',
    },
    {
        name: THREE.MeshMatcapMaterial.name,
        parameters: 'MeshMatcapMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshMatcapMaterial.d.ts',
    },
    {
        name: THREE.LineDashedMaterial.name,
        parameters: 'LineDashedMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/LineDashedMaterial.d.ts',
    },
    {
        name: THREE.LineBasicMaterial.name,
        parameters: 'LineBasicMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/LineBasicMaterial.d.ts',
    },
];

export default async function materialsGenerator(tree: Tree) {
    const { libsDir } = getWorkspaceLayout(tree);
    const materialDir = join(libsDir, 'core', 'materials');

    logger.log('Generating materials...');

    if (!tree.exists(materialDir)) {
        await librarySecondaryEntryPointGenerator(tree, {
            name: 'materials',
            library: 'core',
            skipModule: true,
        });
    }

    const generatedMaterials = [];
    for (const { name, parameters } of materials) {
        const normalizedNames = names(name);

        // inputs stuffs

        generateFiles(
            tree,
            join(__dirname, 'files/lib'),
            join(materialDir, 'src', 'lib', normalizedNames.fileName),
            {
                ...normalizedNames,
                material: name,
                parameters,
                tmpl: '',
            }
        );

        generatedMaterials.push(normalizedNames.fileName);
    }

    generateFiles(
        tree,
        join(__dirname, 'files/index'),
        join(materialDir, 'src'),
        {
            items: generatedMaterials,
            tmpl: '',
        }
    );

    await formatFiles(tree);
}
