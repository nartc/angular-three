import {
  apply,
  applyTemplates,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  url,
} from '@angular-devkit/schematics';
import { classify, dasherize } from '@nrwl/workspace/src/utils/strings';
import * as path from 'path';

import * as THREE from 'three';

export enum Template {
  WithNoArgsNoParams,
  WithArgs,
  WithParams,
}

const sprites = [THREE.Sprite].map((m) => m.name);

const lines = [THREE.Line, THREE.LineLoop, THREE.LineSegments].map(
  (m) => m.name
);

const attributes = [
  THREE.BufferAttribute,
  THREE.InstancedBufferAttribute,
  THREE.Float16BufferAttribute,
  THREE.Float32BufferAttribute,
  THREE.Float64BufferAttribute,
  THREE.Int8BufferAttribute,
  THREE.Int16BufferAttribute,
  THREE.Int32BufferAttribute,
  THREE.Uint8BufferAttribute,
  THREE.Uint16BufferAttribute,
  THREE.Uint32BufferAttribute,
  THREE.Uint8ClampedBufferAttribute,
].map((m) => m.name);

// Use Buffer version to also include normal version
const geometries = [
  'InstancedBufferGeometry',
  'BoxBufferGeometry',
  'CircleBufferGeometry',
  'ConeBufferGeometry',
  'CylinderBufferGeometry',
  'DodecahedronBufferGeometry',
  'ExtrudeBufferGeometry',
  'IcosahedronBufferGeometry',
  'LatheBufferGeometry',
  'OctahedronBufferGeometry',
  'ParametricBufferGeometry',
  'PlaneBufferGeometry',
  'PolyhedronBufferGeometry',
  'RingBufferGeometry',
  'ShapeBufferGeometry',
  'SphereBufferGeometry',
  'TetrahedronBufferGeometry',
  'TextBufferGeometry',
  'TorusBufferGeometry',
  'TorusKnotBufferGeometry',
  'TubeBufferGeometry',
  'WireframeGeometry',
  'EdgesGeometry',
];

const materials = [
  THREE.ShadowMaterial,
  THREE.SpriteMaterial,
  THREE.RawShaderMaterial,
  THREE.ShaderMaterial,
  THREE.PointsMaterial,
  THREE.MeshPhysicalMaterial,
  THREE.MeshStandardMaterial,
  THREE.MeshPhongMaterial,
  THREE.MeshToonMaterial,
  THREE.MeshNormalMaterial,
  THREE.MeshLambertMaterial,
  THREE.MeshDepthMaterial,
  THREE.MeshDistanceMaterial,
  THREE.MeshBasicMaterial,
  THREE.MeshMatcapMaterial,
  THREE.LineDashedMaterial,
  THREE.LineBasicMaterial,
].map((m) => m.name);

const lights = [
  THREE.LightProbe,
  THREE.AmbientLight,
  THREE.AmbientLightProbe,
  THREE.HemisphereLight,
  THREE.HemisphereLightProbe,
  THREE.DirectionalLight,
  THREE.PointLight,
  THREE.SpotLight,
  THREE.RectAreaLight,
].map((m) => m.name);

const curves = [
  THREE.CatmullRomCurve3,
  THREE.CubicBezierCurve,
  THREE.CubicBezierCurve3,
  THREE.EllipseCurve,
  THREE.LineCurve,
  THREE.LineCurve3,
  THREE.QuadraticBezierCurve,
  THREE.QuadraticBezierCurve3,
  THREE.SplineCurve,
].map((m) => m.name);

const helpers = [
  THREE.ArrowHelper,
  THREE.AxesHelper,
  THREE.BoxHelper,
  THREE.Box3Helper,
  THREE.GridHelper,
  THREE.CameraHelper,
  THREE.DirectionalLightHelper,
  THREE.HemisphereLightHelper,
  THREE.PlaneHelper,
  THREE.PointLightHelper,
  THREE.PolarGridHelper,
  THREE.SkeletonHelper,
  THREE.SpotLightHelper,
].map((m) => m.name);

const textures = [
  THREE.CanvasTexture,
  THREE.CompressedTexture,
  THREE.CubeTexture,
  THREE.DataTexture,
  THREE.DataTexture2DArray,
  THREE.DataTexture3D,
  THREE.DepthTexture,
  THREE.VideoTexture,
].map((m) => m.name);

const cameras = [
  THREE.Camera,
  THREE.PerspectiveCamera,
  THREE.OrthographicCamera,
  THREE.ArrayCamera,
  THREE.StereoCamera,
].map((m) => m.name);

const catalogue = {
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

const controls = [
  {
    name: 'OrbitControls',
    injectDocument: false,
    importThree: false,
    useRenderer: true,
    inputs: [],
    constructor: '(camera, renderer.domElement)',
  },
  {
    name: 'FlyControls',
    injectDocument: false,
    importThree: false,
    useRenderer: true,
    inputs: [],
    constructor: '(camera, renderer.domElement)',
  },
  {
    name: 'DeviceOrientationControls',
    injectDocument: false,
    importThree: false,
    useRenderer: false,
    inputs: [],
    constructor: '(camera)',
  },
  {
    name: 'FirstPersonControls',
    injectDocument: false,
    importThree: false,
    useRenderer: true,
    inputs: [],
    constructor: '(camera, renderer.domElement)',
  },
  {
    name: 'PointerLockControls',
    injectDocument: true,
    importThree: false,
    useRenderer: false,
    inputs: [],
    constructor: '(camera, this.document.body)',
  },
  {
    name: 'DragControls',
    injectDocument: false,
    importThree: true,
    useRenderer: true,
    inputs: [
      {
        name: 'objects',
        import: 'Object3D',
        isOptional: false,
        isArray: true,
        default: '[]',
      },
    ],
    constructor: '(this.objects, camera, renderer.domElement)',
  },
  {
    name: 'TrackballControls',
    injectDocument: false,
    importThree: false,
    useRenderer: true,
    inputs: [],
    constructor: '(camera, renderer.domElement)',
  },
  {
    name: 'TransformControls',
    injectDocument: false,
    importThree: false,
    useRenderer: true,
    inputs: [],
    constructor: '(camera, renderer.domElement)',
  },
];

export default function (): Rule {
  return (tree, context) => {
    const derivedObject3Ds = [];
    const templates = [];

    for (const [
      key,
      { items, abstract, type, withThreeObject3d, templateType },
    ] of Object.entries(catalogue)) {
      context.logger.info(`Generating THREE ${classify(key)}`);
      let fileDir = 'with-no-args-no-parameters';

      switch (templateType) {
        case Template.WithParams:
          fileDir = 'with-parameters';
          break;
        case Template.WithArgs:
          fileDir = 'with-args';
          break;
      }

      const keyTemplates = items.map((item) => {
        const dasherizedItem = dasherize(item);
        if (withThreeObject3d) {
          derivedObject3Ds.push(`ngt-${dasherizedItem}`);
        }
        return mergeWith(
          apply(url(`./files/${fileDir}`), [
            applyTemplates({
              name: item,
              alternative: item.includes('BufferGeometry')
                ? item.replace('Buffer', '')
                : '',
              withThreeObject3d,
              abstract,
              type,
              dasherize,
            }),
            move(
              path.normalize(`./packages/core/${key}/src/lib/${dasherizedItem}`)
            ),
          ]),
          MergeStrategy.Overwrite
        );
      });

      let extras = [];

      switch (key) {
        case 'attributes':
          extras = ['interleaved-buffer-attribute'];
          break;
        case 'cameras':
          extras = ['cube-camera'];
          break;
      }

      const indexTemplate = mergeWith(
        apply(url('./files/main'), [
          applyTemplates({ items, extras, dasherize }),
          move(path.normalize(`./packages/core/${key}/src`)),
        ]),
        MergeStrategy.Overwrite
      );

      templates.push(...keyTemplates, indexTemplate);
    }

    context.logger.info('Generating Object3dController');

    templates.push(
      mergeWith(
        apply(url('./files/object-3d-controller'), [
          applyTemplates({
            selectors: derivedObject3Ds.map((selector, index) => ({
              selector,
              isLast: index === derivedObject3Ds.length - 1,
            })),
          }),
          move(path.normalize('./packages/core/src/lib/controllers')),
        ]),
        MergeStrategy.Overwrite
      )
    );

    for (const {
      name,
      importThree,
      useRenderer,
      constructor,
      injectDocument,
      inputs,
    } of controls) {
      context.logger.info(`Generating ${name}`);
      const controlTemplate = mergeWith(
        apply(url('./files/controls/lib'), [
          applyTemplates({
            name,
            constructor,
            injectDocument,
            useRenderer,
            inputs,
            dasherize,
          }),
          move(
            path.normalize(`./packages/controls/${dasherize(name)}/src/lib`)
          ),
        ]),
        MergeStrategy.Overwrite
      );

      const controlIndexTemplate = mergeWith(
        apply(url('./files/controls/index'), [
          applyTemplates({ name, dasherize }),
          move(path.normalize(`./packages/controls/${dasherize(name)}/src`)),
        ]),
        MergeStrategy.Overwrite
      );

      const ngPackageEslintTemplate = mergeWith(
        apply(url('./files/controls/ng-package'), [
          applyTemplates({ name, dasherize, importThree }),
          move(path.normalize(`./packages/controls/${dasherize(name)}`)),
        ]),
        MergeStrategy.Overwrite
      );

      templates.push(
        controlTemplate,
        controlIndexTemplate,
        ngPackageEslintTemplate
      );
    }

    return chain(templates);
  };
}
