import { attributes } from '../../entities/attributes';
import { cameras } from '../../entities/cameras';
import { curves } from '../../entities/curves';
import { geometries } from '../../entities/geometries';
import { helpers } from '../../entities/helpers';
import { lights } from '../../entities/lights';
import { lines } from '../../entities/lines';
import { materials } from '../../entities/materials';
import { sprites } from '../../entities/sprites';
import { textures } from '../../entities/textures';
import { CoreEntityTemplate } from '../../models/core-entity-template.enum';

export const catalogue = {
  attributes: {
    items: attributes.core,
    abstract: 'NgtAttribute',
    withThreeObject3d: false,
    templateType: CoreEntityTemplate.WithArgs,
    type: 'attributeType',
    examples: attributes.examples || [],
    from: attributes.from || {},
  },
  geometries: {
    items: geometries.core,
    abstract: 'NgtGeometry',
    withThreeObject3d: false,
    templateType: CoreEntityTemplate.WithArgs,
    type: 'geometryType',
    examples: geometries.examples || [],
    from: geometries.from || {},
  },
  materials: {
    items: materials.core,
    abstract: 'NgtMaterial',
    withThreeObject3d: false,
    templateType: CoreEntityTemplate.WithParams,
    type: 'materialType',
    examples: materials.examples || [],
    from: materials.from || {},
  },
  lights: {
    items: lights.core,
    abstract: 'NgtLight',
    withThreeObject3d: true,
    templateType: CoreEntityTemplate.WithArgs,
    type: 'lightType',
    examples: lights.examples || [],
    from: lights.from || {},
  },
  curves: {
    items: curves.core,
    abstract: 'NgtCurve',
    withThreeObject3d: false,
    templateType: CoreEntityTemplate.WithArgs,
    type: 'curveType',
    examples: curves.examples || [],
    from: curves.from || {},
  },
  helpers: {
    items: helpers.core,
    abstract: 'NgtHelper',
    withThreeObject3d: true,
    templateType: CoreEntityTemplate.WithArgs,
    type: 'helperType',
    examples: helpers.examples || [],
    from: helpers.from || {},
  },
  textures: {
    items: textures.core,
    abstract: 'NgtTexture',
    withThreeObject3d: false,
    templateType: CoreEntityTemplate.WithArgs,
    type: 'textureType',
    examples: textures.examples || [],
    from: textures.from || {},
  },
  lines: {
    items: lines.core,
    abstract: 'NgtCommonLine',
    withThreeObject3d: true,
    templateType: CoreEntityTemplate.WithNoArgsNoParams,
    type: 'lineType',
    examples: lines.examples || [],
    from: lines.from || {},
  },
  sprites: {
    items: sprites.core,
    abstract: 'NgtCommonSprite',
    withThreeObject3d: true,
    templateType: CoreEntityTemplate.WithNoArgsNoParams,
    type: 'spriteType',
    examples: sprites.examples || [],
    from: sprites.from || {},
  },
  cameras: {
    items: cameras.core,
    abstract: 'NgtCommonCamera',
    withThreeObject3d: true,
    templateType: CoreEntityTemplate.WithArgs,
    type: 'cameraType',
    examples: cameras.examples || [],
    from: cameras.from || {},
  },
};
