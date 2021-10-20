import { attributes } from './entities/attributes';
import { cameras } from './entities/cameras';
import { curves } from './entities/curves';
import { exampleGeometries, geometries } from './entities/geometries';
import { helpers } from './entities/helpers';
import { lights } from './entities/lights';
import { lines } from './entities/lines';
import { materials } from './entities/materials';
import { sprites } from './entities/sprites';
import { textures } from './entities/textures';
import { Template } from './models/template.enum';

export const catalogue = {
  attributes: {
    items: attributes,
    abstract: 'ThreeAttribute',
    withThreeObject3d: false,
    templateType: Template.WithArgs,
    type: 'attributeType',
    examples: []
  },
  geometries: {
    items: geometries,
    abstract: 'ThreeBufferGeometry',
    withThreeObject3d: false,
    templateType: Template.WithArgs,
    type: 'geometryType',
    examples: exampleGeometries
  },
  materials: {
    items: materials,
    abstract: 'ThreeMaterial',
    withThreeObject3d: false,
    templateType: Template.WithParams,
    type: 'materialType',
    examples: []
  },
  lights: {
    items: lights,
    abstract: 'ThreeLight',
    withThreeObject3d: true,
    templateType: Template.WithArgs,
    type: 'lightType',
    examples: []
  },
  curves: {
    items: curves,
    abstract: 'ThreeCurve',
    withThreeObject3d: false,
    templateType: Template.WithArgs,
    type: 'curveType',
    examples: []
  },
  helpers: {
    items: helpers,
    abstract: 'ThreeHelper',
    withThreeObject3d: true,
    templateType: Template.WithArgs,
    type: 'helperType',
    examples: []
  },
  textures: {
    items: textures,
    abstract: 'ThreeTexture',
    withThreeObject3d: false,
    templateType: Template.WithArgs,
    type: 'textureType',
    examples: []
  },
  lines: {
    items: lines,
    abstract: 'ThreeLine',
    withThreeObject3d: true,
    templateType: Template.WithNoArgsNoParams,
    type: 'lineType',
    examples: []
  },
  sprites: {
    items: sprites,
    abstract: 'ThreeSprite',
    withThreeObject3d: true,
    templateType: Template.WithNoArgsNoParams,
    type: 'spriteType',
    examples: []
  },
  cameras: {
    items: cameras,
    abstract: 'ThreeCamera',
    withThreeObject3d: true,
    templateType: Template.WithArgs,
    type: 'cameraType',
    examples: []
  },
};
