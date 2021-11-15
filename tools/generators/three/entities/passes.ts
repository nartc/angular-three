import { NativeImports } from '../models/native-imports.enum';
import type {
  PassCollection,
  ShaderPassEntity,
} from '../models/pass-collection.model';
import { PassImports } from '../models/pass-imports.enum';
import { SceneAndCamera } from '../models/scene-and-camera.enum';
import { ThreeCoreImports } from '../models/three-core-imports.enum';
import { ThreeImports } from '../models/three-imports.enum';

const shaderPass: ShaderPassEntity = {
  threeCoreImports: [ThreeCoreImports.UnknownRecord],
  threeImports: [ThreeImports.ShaderMaterial],
  passImports: [],
  inputs: [
    {
      name: 'textureID',
      import: NativeImports.string,
      isArray: false,
    },
    {
      name: 'uniforms',
      import: ThreeCoreImports.UnknownRecord,
      isArray: false,
    },
    {
      name: 'material',
      import: ThreeImports.ShaderMaterial,
      isArray: false,
    },
    {
      name: 'fsQuad',
      import: ThreeCoreImports.UnknownRecord,
      isArray: false,
    },
  ],
  useSceneAndCamera: null,
};

export const passes: PassCollection = [
  {
    name: 'AdaptiveToneMappingPass',
    threeCoreImports: [ThreeCoreImports.UnknownRecord],
    threeImports: [ThreeImports.WebGLRenderTarget, ThreeImports.ShaderMaterial],
    passImports: [],
    inputs: [
      {
        name: 'needsInit',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'luminanceRT',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'previousLuminanceRT',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'currentLuminanceRT',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'copyUniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'materialCopy',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'materialLuminance',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'adaptLuminanceShader',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'materialAdaptiveLum',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'materialToneMap',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'AfterimagePass',
    threeCoreImports: [ThreeCoreImports.UnknownRecord],
    threeImports: [ThreeImports.WebGLRenderTarget, ThreeImports.ShaderMaterial],
    passImports: [],
    inputs: [
      {
        name: 'shader',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'uniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'textureComp',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'textureOld',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'shaderMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'compFsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'copyFsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'BloomPass',
    threeCoreImports: [ThreeCoreImports.UnknownRecord],
    threeImports: [ThreeImports.WebGLRenderTarget, ThreeImports.ShaderMaterial],
    passImports: [],
    inputs: [
      {
        name: 'renderTargetX',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'renderTargetY',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'copyUniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'materialCopy',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'convolutionUniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'materialConvolution',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'BokehPass',
    threeCoreImports: [
      ThreeCoreImports.UnknownRecord,
      ThreeCoreImports.LessFirstTwoConstructorParameters,
    ],
    threeImports: [
      ThreeImports.WebGLRenderTarget,
      ThreeImports.ShaderMaterial,
      ThreeImports.MeshDepthMaterial,
      ThreeImports.Color,
    ],
    passImports: [],
    inputs: [
      {
        name: 'renderTargetColor',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'renderTargetDepth',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'materialDepth',
        import: ThreeImports.MeshDepthMaterial,
        isArray: false,
      },
      {
        name: 'materialBokeh',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'uniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'oldClearColor',
        import: ThreeImports.Color,
        isArray: false,
      },
    ],
    useSceneAndCamera: SceneAndCamera.SceneAndCamera,
  },
  {
    name: 'ClearPass',
    threeCoreImports: [],
    threeImports: [],
    passImports: [],
    inputs: [],
    useSceneAndCamera: null,
  },
  {
    name: 'CubeTexturePass',
    threeCoreImports: [
      ThreeCoreImports.UnknownRecord,
      ThreeCoreImports.LessFirstConstructorParameters,
    ],
    threeImports: [
      ThreeImports.Mesh,
      ThreeImports.CubeTexture,
      ThreeImports.PerspectiveCamera,
      ThreeImports.Scene,
    ],
    passImports: [],
    inputs: [
      {
        name: 'cubeShader',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'cubeMesh',
        import: ThreeImports.Mesh,
        isArray: false,
      },
      {
        name: 'envMap',
        import: ThreeImports.CubeTexture,
        isArray: false,
      },
      {
        name: 'cubeScene',
        import: ThreeImports.Scene,
        isArray: false,
      },
      {
        name: 'cubeCamera',
        import: ThreeImports.PerspectiveCamera,
        isArray: false,
      },
    ],
    useSceneAndCamera: SceneAndCamera.Camera,
  },
  {
    name: 'DotScreenPass',
    threeCoreImports: [ThreeCoreImports.UnknownRecord],
    threeImports: [ThreeImports.ShaderMaterial],
    passImports: [],
    inputs: [
      {
        name: 'uniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'material',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'FilmPass',
    threeCoreImports: [ThreeCoreImports.UnknownRecord],
    threeImports: [ThreeImports.ShaderMaterial],
    passImports: [],
    inputs: [
      {
        name: 'uniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'material',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'GlitchPass',
    threeCoreImports: [ThreeCoreImports.UnknownRecord],
    threeImports: [ThreeImports.ShaderMaterial],
    passImports: [],
    inputs: [
      {
        name: 'uniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'material',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'goWild',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'curF',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'randX',
        import: NativeImports.number,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'HalftonePass',
    threeCoreImports: [ThreeCoreImports.UnknownRecord],
    threeImports: [ThreeImports.ShaderMaterial],
    passImports: [],
    inputs: [
      {
        name: 'uniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'material',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'LUTPass',
    threeCoreImports: [...shaderPass.threeCoreImports],
    threeImports: [
      ...shaderPass.threeImports,
      ThreeImports.DataTexture,
      ThreeImports.DataTexture3D,
    ],
    passImports: [],
    inputs: [
      {
        name: 'lut',
        import: `${ThreeImports.DataTexture} | ${ThreeImports.DataTexture3D}`,
        isArray: false,
      },
      {
        name: 'intensity',
        import: NativeImports.number,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'MaskPass',
    threeCoreImports: [ThreeCoreImports.LessFirstTwoConstructorParameters],
    threeImports: [],
    passImports: [],
    inputs: [
      {
        name: 'inverse',
        import: NativeImports.boolean,
        isArray: false,
      },
    ],
    useSceneAndCamera: SceneAndCamera.SceneAndCamera,
  },
  {
    /**

     */
    name: 'OutlinePass',
    threeCoreImports: [ThreeCoreImports.UnknownRecord],
    threeImports: [
      ThreeImports.Scene,
      ThreeImports.Camera,
      ThreeImports.Object3D,
      ThreeImports.Color,
      ThreeImports.Vector2,
      ThreeImports.Texture,
      ThreeImports.MeshBasicMaterial,
      ThreeImports.WebGLRenderTarget,
      ThreeImports.MeshDepthMaterial,
      ThreeImports.ShaderMaterial,
      ThreeImports.Matrix4,
    ],
    passImports: [],
    inputs: [
      {
        name: 'renderScene',
        import: ThreeImports.Scene,
        isArray: false,
      },
      {
        name: 'renderCamera',
        import: ThreeImports.Camera,
        isArray: false,
      },
      {
        name: 'selectedObjects',
        import: ThreeImports.Object3D,
        isArray: true,
      },
      {
        name: 'visibleEdgeColor',
        import: ThreeImports.Color,
        isArray: false,
      },
      {
        name: 'hiddenEdgeColor',
        import: ThreeImports.Color,
        isArray: false,
      },
      {
        name: 'edgeGlow',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'usePatternTexture',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'edgeThickness',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'edgeStrength',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'downSampleRatio',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'pulsePeriod',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'resolution',
        import: ThreeImports.Vector2,
        isArray: false,
      },
      {
        name: 'patternTexture',
        import: ThreeImports.Texture,
        isArray: false,
      },
      {
        name: 'maskBufferMaterial',
        import: ThreeImports.MeshBasicMaterial,
        isArray: false,
      },
      {
        name: 'renderTargetMaskBuffer',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'depthMaterial',
        import: ThreeImports.MeshDepthMaterial,
        isArray: false,
      },
      {
        name: 'prepareMaskMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'renderTargetDepthBuffer',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'renderTargetMaskDownSampleBuffer',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'renderTargetBlurBuffer1',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'renderTargetBlurBuffer2',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'edgeDetectionMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'renderTargetEdgeBuffer1',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'renderTargetEdgeBuffer2',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'separableBlurMaterial1',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'separableBlurMaterial2',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'overlayMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'copyUniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'materialCopy',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'oldClearColor',
        import: ThreeImports.Color,
        isArray: false,
      },
      {
        name: 'oldClearAlpha',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'tempPulseColor1',
        import: ThreeImports.Color,
        isArray: false,
      },
      {
        name: 'tempPulseColor2',
        import: ThreeImports.Color,
        isArray: false,
      },
      {
        name: 'textureMatrix',
        import: ThreeImports.Matrix4,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'RenderPass',
    threeCoreImports: [ThreeCoreImports.LessFirstTwoConstructorParameters],
    threeImports: [],
    passImports: [],
    inputs: [
      {
        name: 'clearDepth',
        import: NativeImports.boolean,
        isArray: false,
      },
    ],
    useSceneAndCamera: SceneAndCamera.SceneAndCamera,
  },
  {
    name: 'SAOPass',
    threeCoreImports: [
      ThreeCoreImports.LessFirstTwoConstructorParameters,
      ThreeCoreImports.UnknownRecord,
    ],
    threeImports: [
      ThreeImports.Color,
      ThreeImports.Vector2,
      ThreeImports.WebGLRenderTarget,
      ThreeImports.MeshDepthMaterial,
      ThreeImports.MeshNormalMaterial,
      ThreeImports.ShaderMaterial,
    ],
    passImports: [PassImports.SAOPassParams],
    inputs: [
      {
        name: 'supportsDepthTextureExtension',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'supportsNormalTexture',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'originalClearColor',
        import: ThreeImports.Color,
        isArray: false,
      },
      {
        name: 'oldClearColor',
        import: ThreeImports.Color,
        isArray: false,
      },
      {
        name: 'oldClearAlpha',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'resolution',
        import: ThreeImports.Vector2,
        isArray: false,
      },
      {
        name: 'saoRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'blurIntermediateRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'beautyRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'normalRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'depthRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'depthMaterial',
        import: ThreeImports.MeshDepthMaterial,
        isArray: false,
      },
      {
        name: 'normalMaterial',
        import: ThreeImports.MeshNormalMaterial,
        isArray: false,
      },
      {
        name: 'saoMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'vBlurMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'hBlurMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'materialCopy',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'depthCopy',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'params',
        import: PassImports.SAOPassParams,
        isArray: false,
      },
    ],
    useSceneAndCamera: SceneAndCamera.SceneAndCamera,
  },
  {
    name: 'SavePass',
    threeCoreImports: [ThreeCoreImports.UnknownRecord],
    threeImports: [ThreeImports.WebGLRenderTarget, ThreeImports.ShaderMaterial],
    passImports: [],
    inputs: [
      {
        name: 'textureID',
        import: NativeImports.string,
        isArray: false,
      },
      {
        name: 'renderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'uniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'material',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'ShaderPass',
    ...shaderPass,
  },
  {
    name: 'SMAAPass',
    threeCoreImports: [ThreeCoreImports.UnknownRecord],
    threeImports: [
      ThreeImports.WebGLRenderTarget,
      ThreeImports.Texture,
      ThreeImports.ShaderMaterial,
    ],
    passImports: [],
    inputs: [
      {
        name: 'edgesRT',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'weightsRT',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'areaTexture',
        import: ThreeImports.Texture,
        isArray: false,
      },
      {
        name: 'searchTexture',
        import: ThreeImports.Texture,
        isArray: false,
      },
      {
        name: 'uniformsEdges',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'materialEdges',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'uniformsWeights',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'materialWeights',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'uniformsBlend',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'materialBlend',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'SSAARenderPass',
    threeCoreImports: [
      ThreeCoreImports.NgtColor,
      ThreeCoreImports.UnknownRecord,
      ThreeCoreImports.LessFirstTwoConstructorParameters,
    ],
    threeImports: [ThreeImports.ShaderMaterial, ThreeImports.WebGLRenderTarget],
    passImports: [],
    inputs: [
      {
        name: 'sampleLevel',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'unbiased',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'clearColor',
        import: ThreeCoreImports.NgtColor,
        isArray: false,
      },
      {
        name: 'clearAlpha',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'copyUniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'copyMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'sampleRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
    ],
    useSceneAndCamera: SceneAndCamera.SceneAndCamera,
  },
  {
    name: 'SSAOPass',
    threeCoreImports: [
      ThreeCoreImports.LessFirstTwoConstructorParameters,
      ThreeCoreImports.UnknownRecord,
    ],
    threeImports: [
      ThreeImports.Vector3,
      ThreeImports.DataTexture,
      ThreeImports.WebGLRenderTarget,
      ThreeImports.ShaderMaterial,
      ThreeImports.MeshNormalMaterial,
      ThreeImports.Color,
    ],
    passImports: [PassImports.SSAOPassOUTPUT],
    inputs: [
      {
        name: 'clear',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'kernelRadius',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'kernelSize',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'kernel',
        import: ThreeImports.Vector3,
        isArray: true,
      },
      {
        name: 'noiseTexture',
        import: ThreeImports.DataTexture,
        isArray: false,
      },
      {
        name: 'output',
        import: PassImports.SSAOPassOUTPUT,
        isArray: false,
      },
      {
        name: 'minDistance',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'maxDistance',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'beautyRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'normalRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'ssaoRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'blurRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'ssaoMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'normalMaterial',
        import: ThreeImports.MeshNormalMaterial,
        isArray: false,
      },
      {
        name: 'blurMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'depthRenderMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'copyMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'originalClearColor',
        import: ThreeImports.Color,
        isArray: false,
      },
    ],
    useSceneAndCamera: SceneAndCamera.SceneAndCamera,
  },
  {
    name: 'SSRPass',
    threeCoreImports: [],
    threeImports: [
      ThreeImports.WebGLRenderer,
      ThreeImports.Scene,
      ThreeImports.Camera,
      ThreeImports.TextureEncoding,
      ThreeImports.Color,
      ThreeImports.WebGLRenderTarget,
      ThreeImports.ShaderMaterial,
      ThreeImports.MeshNormalMaterial,
      ThreeImports.MeshBasicMaterial,
    ],
    importReflector: true,
    importFsQuad: true,
    passImports: [],
    inputs: [
      {
        name: 'width',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'height',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'clear',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'renderer',
        import: ThreeImports.WebGLRenderer,
        isArray: false,
      },
      {
        name: 'scene',
        import: ThreeImports.Scene,
        isArray: false,
      },
      {
        name: 'camera',
        import: ThreeImports.Camera,
        isArray: false,
      },
      {
        name: 'groundReflector',
        import: 'Reflector | null',
        isArray: false,
      },
      {
        name: 'opacity',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'output',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'maxDistance',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'surfDist',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'encoding',
        import: ThreeImports.TextureEncoding,
        isArray: false,
      },
      {
        name: 'tempColor',
        import: ThreeImports.Color,
        isArray: false,
      },
      {
        name: 'selective',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'blur',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'thickTolerance',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'beautyRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'prevRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'normalRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'metalnessRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'ssrRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'blurRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'blurRenderTarget2',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'ssrMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'normalMaterial',
        import: ThreeImports.MeshNormalMaterial,
        isArray: false,
      },
      {
        name: 'metalnessOnMaterial',
        import: ThreeImports.MeshBasicMaterial,
        isArray: false,
      },
      {
        name: 'metalnessOffMaterial',
        import: ThreeImports.MeshBasicMaterial,
        isArray: false,
      },
      {
        name: 'blurMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'blurMaterial2',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'depthRenderMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'copyMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: 'FullScreenQuad',
        isArray: false,
      },
      {
        name: 'originalClearColor',
        import: ThreeImports.Color,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'SSRrPass',
    threeCoreImports: [],
    threeImports: [
      ThreeImports.WebGLRenderer,
      ThreeImports.Scene,
      ThreeImports.Camera,
      ThreeImports.TextureEncoding,
      ThreeImports.Color,
      ThreeImports.Mesh,
      ThreeImports.WebGLRenderTarget,
      ThreeImports.ShaderMaterial,
      ThreeImports.MeshNormalMaterial,
      ThreeImports.MeshBasicMaterial,
      ThreeImports.MeshStandardMaterial,
    ],
    importFsQuad: true,
    passImports: [],
    inputs: [
      {
        name: 'width',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'height',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'clear',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'renderer',
        import: ThreeImports.WebGLRenderer,
        isArray: false,
      },
      {
        name: 'scene',
        import: ThreeImports.Scene,
        isArray: false,
      },
      {
        name: 'camera',
        import: ThreeImports.Camera,
        isArray: false,
      },
      {
        name: 'output',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'ior',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'maxDistance',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'surfDist',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'encoding',
        import: ThreeImports.TextureEncoding,
        isArray: false,
      },
      {
        name: 'color',
        import: ThreeImports.Color,
        isArray: false,
      },
      {
        name: 'selects',
        import: `null | ${ThreeImports.Mesh}`,
        isArray: true,
      },
      {
        name: 'specular',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'fillHole',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'infiniteThick',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'beautyRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'specularRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'normalSelectsRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'refractiveRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'ssrrRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'ssrrMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'normalMaterial',
        import: ThreeImports.MeshNormalMaterial,
        isArray: false,
      },
      {
        name: 'refractiveOnMaterial',
        import: ThreeImports.MeshBasicMaterial,
        isArray: false,
      },
      {
        name: 'refractiveOffMaterial',
        import: ThreeImports.MeshBasicMaterial,
        isArray: false,
      },
      {
        name: 'specularMaterial',
        import: ThreeImports.MeshStandardMaterial,
        isArray: false,
      },
      {
        name: 'depthRenderMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'copyMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: 'FullScreenQuad',
        isArray: false,
      },
      {
        name: 'originalClearColor',
        import: ThreeImports.Color,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'TAARenderPass',
    threeCoreImports: [
      ThreeCoreImports.NgtColor,
      ThreeCoreImports.UnknownRecord,
      ThreeCoreImports.LessFirstTwoConstructorParameters,
    ],
    threeImports: [ThreeImports.ShaderMaterial, ThreeImports.WebGLRenderTarget],
    passImports: [],
    inputs: [
      {
        name: 'sampleLevel',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'unbiased',
        import: NativeImports.boolean,
        isArray: false,
      },
      {
        name: 'clearColor',
        import: ThreeCoreImports.NgtColor,
        isArray: false,
      },
      {
        name: 'clearAlpha',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'copyUniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'copyMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'sampleRenderTarget',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'accumulate',
        import: NativeImports.boolean,
        isArray: false,
      },
    ],
    useSceneAndCamera: SceneAndCamera.SceneAndCamera,
  },
  {
    name: 'TexturePass',
    threeCoreImports: [ThreeCoreImports.UnknownRecord],
    threeImports: [ThreeImports.ShaderMaterial],
    passImports: [],
    inputs: [
      {
        name: 'uniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'material',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
  {
    name: 'UnrealBloomPass',
    threeCoreImports: [ThreeCoreImports.UnknownRecord],
    threeImports: [
      ThreeImports.Color,
      ThreeImports.WebGLRenderTarget,
      ThreeImports.ShaderMaterial,
      ThreeImports.Vector3,
      ThreeImports.MeshBasicMaterial,
    ],
    passImports: [],
    inputs: [
      {
        name: 'clearColor',
        import: ThreeImports.Color,
        isArray: false,
      },
      {
        name: 'renderTargetsHorizontal',
        import: ThreeImports.WebGLRenderTarget,
        isArray: true,
      },
      // : WebGLRenderTarget[];
      {
        name: 'renderTargetsVertical',
        import: ThreeImports.WebGLRenderTarget,
        isArray: true,
      },
      {
        name: 'nMips',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'renderTargetBright',
        import: ThreeImports.WebGLRenderTarget,
        isArray: false,
      },
      {
        name: 'highPassUniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'materialHighPassFilter',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'separableBlurMaterials',
        import: ThreeImports.ShaderMaterial,
        isArray: true,
      },
      {
        name: 'compositeMaterial',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'bloomTintColors',
        import: ThreeImports.Vector3,
        isArray: true,
      },
      {
        name: 'copyUniforms',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
      {
        name: 'materialCopy',
        import: ThreeImports.ShaderMaterial,
        isArray: false,
      },
      {
        name: 'oldClearColor',
        import: ThreeImports.Color,
        isArray: false,
      },
      {
        name: 'oldClearAlpha',
        import: NativeImports.number,
        isArray: false,
      },
      {
        name: 'basic',
        import: ThreeImports.MeshBasicMaterial,
        isArray: false,
      },
      {
        name: 'fsQuad',
        import: ThreeCoreImports.UnknownRecord,
        isArray: false,
      },
    ],
    useSceneAndCamera: null,
  },
];
