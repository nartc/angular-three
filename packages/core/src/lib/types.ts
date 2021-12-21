import * as THREE from 'three';

export type UnknownRecord = Record<string, unknown>;
export type AnyFunction<TObject> = () => TObject;
export type AnyConstructor<TObject> = new (...args: any[]) => TObject;
export type AnyExtenderFunction<TObject> = (object: TObject) => void;

export type Tail<T extends any[]> = T extends [infer A, ...infer R] ? R : never;

export type Properties<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]
>;

export type ConditionalType<Child, Parent, Truthy, Falsy> = Child extends Parent
  ? Truthy
  : Falsy;

export type BranchingReturn<
  T = any,
  Parent = any,
  Coerced = any
> = ConditionalType<T, Parent, Coerced, T>;

// TODO: fix these
// export type LessFirstConstructorParameters<
//   T extends AnyConstructor<any>,
//   TConstructor = ConstructorParameters<T>
// > = TConstructor extends [infer First, ...infer Rest] ? Rest : TConstructor;
// export type LessFirstTwoConstructorParameters<
//   T extends AnyConstructor<any>,
//   TConstructor = ConstructorParameters<T>
// > = TConstructor extends [infer First, infer Second, ...infer Rest]
//   ? Rest
//   : TConstructor;

export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export type Overwrite<T, O> = Omit<T, NonFunctionKeys<O>> & O;

export type NgtTriplet = [x: number, y: number, z: number];
export type NgtQuad = [x: number, y: number, z: number, w: number];

export type NgtEuler = THREE.Euler | Parameters<THREE.Euler['set']>;
export type NgtMatrix4 = THREE.Matrix4 | Parameters<THREE.Matrix4['set']>;
export type NgtVector2 =
  | THREE.Vector2
  | Parameters<THREE.Vector2['set']>
  | Parameters<THREE.Vector2['setScalar']>[0];
export type NgtVector3 =
  | THREE.Vector3
  | Parameters<THREE.Vector3['set']>
  | Parameters<THREE.Vector3['setScalar']>[0];
export type NgtVector4 =
  | THREE.Vector4
  | Parameters<THREE.Vector4['set']>
  | Parameters<THREE.Vector4['setScalar']>[0];
export type NgtColor = THREE.ColorRepresentation;
export type NgtColorArray = typeof THREE.Color | Parameters<THREE.Color['set']>;
export type NgtLayers = THREE.Layers | Parameters<THREE.Layers['set']>[0];
export type NgtQuaternion =
  | THREE.Quaternion
  | Parameters<THREE.Quaternion['set']>;

export interface NgtCommonParameters {
  position?: NgtVector3;
  up?: NgtVector3;
  scale?: NgtVector3;
  rotation?: NgtEuler;
  matrix?: NgtMatrix4;
  quaternion?: NgtQuaternion;
  layers?: NgtLayers;
  background?: NgtColor;
  dispose?: (() => void) | null;
}

export interface NgtCanvasOptions {
  projectContent?: boolean;
}

export type NgtGLOptions =
  | THREE.Renderer
  | ((canvas: HTMLCanvasElement) => THREE.Renderer)
  | Partial<Properties<THREE.WebGLRenderer> | THREE.WebGLRendererParameters>;

export type NgtCamera = THREE.OrthographicCamera | THREE.PerspectiveCamera;

export type NgtCameraOptions =
  | NgtCamera
  | Overwrite<Partial<THREE.PerspectiveCamera>, NgtCommonParameters>
  | Overwrite<Partial<THREE.OrthographicCamera>, NgtCommonParameters>;

export type NgtDpr = number | [min: number, max: number];

export interface NgtSize {
  width: number;
  height: number;
}

export type NgtViewport = NgtSize & {
  initialDpr: number;
  dpr: number;
  factor: number;
  distance: number;
  aspect: number;
};

export type NgtCurrentViewport = Omit<NgtViewport, 'dpr' | 'initialDpr'>;

export interface NgtRender {
  clock: THREE.Clock;
  size: NgtSize;
  viewport: NgtViewport;
  renderer: THREE.WebGLRenderer;
  camera: NgtCamera;
  scene: THREE.Scene;
  mouse: THREE.Vector2;
  delta: number;
}

export interface NgtIntersection extends THREE.Intersection {
  eventObject: THREE.Object3D;
}

export interface NgtIntersectionEvent<TSourceEvent> extends NgtIntersection {
  intersections: NgtIntersection[];
  stopped: boolean;
  unprojectedPoint: THREE.Vector3;
  ray: THREE.Ray;
  camera: THREE.Camera;
  stopPropagation: () => void;
  /**
   * @deprecated use {@link nativeEvent}
   */
  sourceEvent: TSourceEvent;
  nativeEvent: TSourceEvent;
  delta: number;
}

export interface NgtPointerCaptureTarget {
  intersection: NgtIntersection;
  target: Element;
}

export type NgtEvent<TEvent> = NgtIntersectionEvent<TEvent>;
export type NgtDomEvent = PointerEvent | MouseEvent | WheelEvent;

export interface NgtEventHandlers {
  click?: (event: NgtEvent<MouseEvent>) => void;
  contextmenu?: (event: NgtEvent<MouseEvent>) => void;
  dblclick?: (event: NgtEvent<MouseEvent>) => void;
  pointerup?: (event: NgtEvent<PointerEvent>) => void;
  pointerdown?: (event: NgtEvent<PointerEvent>) => void;
  pointerover?: (event: NgtEvent<PointerEvent>) => void;
  pointerout?: (event: NgtEvent<PointerEvent>) => void;
  pointerenter?: (event: NgtEvent<PointerEvent>) => void;
  pointerleave?: (event: NgtEvent<PointerEvent>) => void;
  pointermove?: (event: NgtEvent<PointerEvent>) => void;
  pointermissed?: (event: MouseEvent) => void;
  pointercancel?: (event: NgtEvent<PointerEvent>) => void;
  wheel?: (event: NgtEvent<WheelEvent>) => void;
}

export type NgtAnimationCallback<TObject> = (
  state: NgtRender,
  obj: TObject
) => void;

export interface NgtAnimationRecord {
  obj?: THREE.Object3D;
  callback: NgtAnimationCallback<THREE.Object3D | undefined>;
  priority?: number;
}

export interface NgtAnimationFrameStoreState {
  animations: Record<string, NgtAnimationRecord>;
  subscribers: Array<NgtAnimationRecord>;
  hasPriority: boolean;
}

export type NgtSupportedEvents =
  | 'click'
  | 'contextmenu'
  | 'dblclick'
  | 'wheel'
  | 'pointerdown'
  | 'pointerup'
  | 'pointerleave'
  | 'pointermove'
  | 'pointercancel'
  | 'pointermissed'
  | 'lostpointercapture';

export interface NgtEventsInternal {
  interaction: THREE.Object3D[];
  hovered: Map<string, NgtEvent<NgtDomEvent>>;
  capturedMap: Map<number, Map<THREE.Object3D, NgtPointerCaptureTarget>>;
  initialClick: [x: number, y: number];
  initialHits: THREE.Object3D[];
}

export type FilterFunction = (
  items: THREE.Intersection[],
  state: NgtRender
) => THREE.Intersection[];

export type ComputeOffsetsFunction = <TEvent = unknown>(
  event: TEvent,
  state: NgtRender
) => { offsetX: number; offsetY: number };

export interface NgtRaycaster extends THREE.Raycaster {
  enabled: boolean;
  filter?: FilterFunction;
  computeOffsets?: ComputeOffsetsFunction;
}

export interface NgtRaycasterOptions {
  origin?: NgtVector3;
  direction?: NgtVector3;
  near?: number;
  far?: number;
}

export type NgtSceneOptions = Overwrite<
  Partial<
    Omit<THREE.Scene, 'isScene' | 'onBeforeRender' | 'onAfterRender' | 'type'>
  >,
  NgtCommonParameters
>;

export interface NgtEventsStoreState {
  pointerMissed?: (event: MouseEvent) => void;
  connected: false | HTMLElement;
  internal: NgtEventsInternal;
  handlers?: Record<NgtSupportedEvents, EventListener>;
}

export interface NgtPerformance {
  current?: number;
  min?: number;
  max?: number;
  debounce?: number;
}

export interface NgtInstanceInternal {
  stateGetter: () => NgtState;
  eventsStateGetter: () => NgtEventsStoreState;
  handlers?: NgtEventHandlers;
  eventCount: number;
  linear: boolean;
}

export type NgtInstance = THREE.Object3D & { __ngt?: NgtInstanceInternal };

export interface NgtState {
  ready: boolean;
  vr: boolean;
  linear: boolean;
  flat: boolean;
  orthographic: boolean;
  mouse: THREE.Vector2;
  clock: THREE.Clock;
  frameloop: 'always' | 'demand' | 'never';
  performance: NgtPerformance;
  dpr: NgtDpr;
  size: NgtSize;
  viewport: NgtViewport & {
    getCurrentViewport: (
      camera?: NgtCamera,
      target?: THREE.Vector3,
      size?: NgtSize
    ) => NgtCurrentViewport;
  };
  controls: THREE.EventDispatcher | null;
  raycasterOptions: Partial<NgtRaycaster>;
  shadows: boolean | Partial<THREE.WebGLShadowMap>;
  cameraOptions: NgtCameraOptions;
  sceneOptions: NgtSceneOptions;
  glOptions: NgtGLOptions;
  renderer: THREE.WebGLRenderer;
  camera: NgtCamera;
  scene: THREE.Scene;
  raycaster: NgtRaycaster;
  objects: Record<string, NgtInstance>;
}

export interface NgtCreatedState {
  mouse: THREE.Vector2;
  clock: THREE.Clock;
  renderer: THREE.WebGLRenderer;
  size: NgtSize;
  viewport: NgtViewport;
  camera: NgtCamera;
  scene: THREE.Scene;
  raycaster: NgtRaycaster;
}

export interface NgtLoader<T> extends THREE.Loader {
  load(
    url: string | string[],
    onLoad?: (result: T) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void
  ): unknown;
}

export interface LoaderExtensions {
  (loader: THREE.Loader): void;
}

export type NgtLoaderResult<T> = T extends any[]
  ? NgtLoader<T[number]>
  : NgtLoader<T>;

export interface NgtObject3dProps {
  name?: string;
  position?: NgtVector3;
  rotation?: NgtEuler;
  quaternion?: NgtQuaternion;
  scale?: NgtVector3;
  color?: NgtColor;
  userData?: UnknownRecord;
  dispose?: (() => void) | null;
  raycast?: THREE.Object3D['raycast'];
  castShadow?: boolean;
  receiveShadow?: boolean;
  visible?: boolean;
  matrixAutoUpdate?: boolean;
}

export interface NgtObjectMap {
  nodes: { [name: string]: THREE.Object3D };
  materials: { [name: string]: THREE.Material };
}
