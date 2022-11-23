import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';

export const attributes = [
    {
        name: THREE.BufferAttribute.name,
        defaultArgs: '[[], 0]',
    },
    {
        name: THREE.InstancedBufferAttribute.name,
        defaultArgs: '[[], 0]',
    },
    {
        name: THREE.InterleavedBufferAttribute.name,
        defaultArgs: '[new THREE.InterleavedBuffer([], 0), 0, 0]',
    },
    {
        name: THREE.Float16BufferAttribute.name,
        defaultArgs: '[[], 0]',
    },
    {
        name: THREE.Float32BufferAttribute.name,
        defaultArgs: '[[], 0]',
    },
    {
        name: THREE.Float64BufferAttribute.name,
        defaultArgs: '[[], 0]',
    },
    {
        name: THREE.Int8BufferAttribute.name,
        defaultArgs: '[[], 0]',
    },
    {
        name: THREE.Int16BufferAttribute.name,
        defaultArgs: '[[], 0]',
    },
    {
        name: THREE.Int32BufferAttribute.name,
        defaultArgs: '[[], 0]',
    },
    {
        name: THREE.Uint8BufferAttribute.name,
        defaultArgs: '[[], 0]',
    },
    {
        name: THREE.Uint16BufferAttribute.name,
        defaultArgs: '[[], 0]',
    },
    {
        name: THREE.Uint32BufferAttribute.name,
        defaultArgs: '[[], 0]',
    },
    {
        name: THREE.Uint8ClampedBufferAttribute.name,
        defaultArgs: '[[], 0]',
    },
    {
        name: THREE.Color.name,
    },
    {
        name: THREE.Fog.name,
        defaultArgs: '["white"]',
    },
    {
        name: THREE.FogExp2.name,
        defaultArgs: '["#fff"]',
    },
    {
        name: THREE.Vector2.name,
    },
    {
        name: THREE.Vector3.name,
    },
    {
        name: THREE.Vector4.name,
    },
    {
        name: THREE.Matrix3.name,
    },
    {
        name: THREE.Matrix4.name,
    },
];

export default async function attributesGenerator(tree: Tree, ngtVersion: string) {
    const { libsDir } = getWorkspaceLayout(tree);
    const attributeDir = join(libsDir, 'angular-three', 'attributes');

    logger.log('Generating attributes...');

    if (!tree.exists(attributeDir)) {
        await librarySecondaryEntryPointGenerator(tree, {
            name: 'attributes',
            library: 'angular-three',
            skipModule: true,
        });
    }

    const generatedAttributes = [];
    for (const attribute of attributes) {
        const normalizedNames = names(attribute.name);

        const selector = normalizedNames.fileName;
        if (!normalizedNames.fileName.endsWith('-attribute')) {
            normalizedNames.fileName = normalizedNames.fileName.concat('-attribute');
        }

        generateFiles(tree, join(__dirname, 'files/lib'), join(attributeDir, 'src', 'lib', normalizedNames.fileName), {
            ...normalizedNames,
            selector,
            threeClass: attribute.name,
            defaultArgs: attribute.defaultArgs || '[]',
            tmpl: '',
            ngtVersion,
        });

        generatedAttributes.push(normalizedNames.fileName);
    }

    generateFiles(tree, join(__dirname, '../common/files/index'), join(attributeDir, 'src'), {
        items: [...generatedAttributes, 'value-attribute'],
        tmpl: '',
        ngtVersion,
    });

    generateFiles(tree, join(__dirname, '../common/files/inputs-outputs'), join(attributeDir, 'src/lib'), {
        tmpl: '',
        ngtVersion,
        hasObject3D: false,
    });
}
