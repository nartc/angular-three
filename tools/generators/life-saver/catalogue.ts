import { attributes } from './entities/attributes';
import { cameras } from './entities/cameras';
import { curves } from './entities/curves';
import { geometries } from './entities/geometries';
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
  },
  geometries: {
    items: geometries,
    abstract: 'ThreeBufferGeometry',
    withThreeObject3d: false,
    templateType: Template.WithArgs,
    type: 'geometryType',
  },
  materials: {
    items: materials,
    abstract: 'ThreeMaterial',
    withThreeObject3d: false,
    templateType: Template.WithParams,
    type: 'materialType',
  },
  lights: {
    items: lights,
    abstract: 'ThreeLight',
    withThreeObject3d: true,
    templateType: Template.WithArgs,
    type: 'lightType',
  },
  curves: {
    items: curves,
    abstract: 'ThreeCurve',
    withThreeObject3d: false,
    templateType: Template.WithArgs,
    type: 'curveType',
  },
  helpers: {
    items: helpers,
    abstract: 'ThreeHelper',
    withThreeObject3d: true,
    templateType: Template.WithArgs,
    type: 'helperType',
  },
  textures: {
    items: textures,
    abstract: 'ThreeTexture',
    withThreeObject3d: false,
    templateType: Template.WithArgs,
    type: 'textureType',
  },
  lines: {
    items: lines,
    abstract: 'ThreeLine',
    withThreeObject3d: true,
    templateType: Template.WithNoArgsNoParams,
    type: 'lineType',
  },
  sprites: {
    items: sprites,
    abstract: 'ThreeSprite',
    withThreeObject3d: true,
    templateType: Template.WithNoArgsNoParams,
    type: 'spriteType',
  },
  cameras: {
    items: cameras,
    abstract: 'ThreeCamera',
    withThreeObject3d: true,
    templateType: Template.WithArgs,
    type: 'cameraType',
  },
};
