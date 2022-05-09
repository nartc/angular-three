import * as THREE from 'three';
import type { Ref } from './ref';

/* Coercion */
export type BooleanInput = string | boolean | null | undefined;
export type NumberInput = string | number | null | undefined;

/* Common + Utility */
export type EquConfig = {
  /** Compare arrays by reference equality a === b (default), or by shallow equality */
  arrays?: 'reference' | 'shallow';
  /** Compare objects by reference equality a === b (default), or by shallow equality */
  objects?: 'reference' | 'shallow';
  /** If true the keys in both a and b must match 1:1 (default), if false a's keys must intersect b's */
  strict?: boolean;
};
export type UnknownRecord = Record<string, unknown>;
export type AnyFunction<TReturn = any> = (...args: any[]) => TReturn;
export type AnyConstructor<TObject> = new (...args: any[]) => TObject;
export type AnyAbstractConstructor<TObject> = abstract new (...args: any[]) => TObject;
/**
 * If **T** contains a constructor, @see ConstructorParameters must be used, otherwise **T**.
 */
type NgtArgs<T> = T extends new (...args: any) => any ? ConstructorParameters<T> : T;

export type AnyCtor<TObject> = AnyConstructor<TObject> & AnyAbstractConstructor<TObject>;

export type AnyExtenderFunction<TObject> = (object: TObject) => void;

export type Tail<X extends readonly any[]> = ((...args: X) => any) extends (arg: any, ...rest: infer U) => any
  ? U
  : never;

export type Properties<T> = Pick<T, { [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]>;

export type ConditionalType<Child, Parent, Truthy, Falsy> = Child extends Parent ? Truthy : Falsy;

export interface NgtLoaderProto<T> extends THREE.Loader {
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

export type NgtLoaderResult<T> = T extends any[] ? NgtLoaderProto<T[number]> : NgtLoaderProto<T>;
export type BranchingReturn<T = any, Parent = any, Coerced = any> = ConditionalType<T, Parent, Coerced, T>;

export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export type Overwrite<T, O> = Omit<T, NonFunctionKeys<O>> & O;

/* AngularThree */
export type NgtDouble = [x: number, y: number];
export type NgtTriple = [x: number, y: number, z: number];
export type NgtQuadruple = [x: number, y: number, z: number, w: number];

export type NgtEuler = THREE.Euler | Parameters<THREE.Euler['set']>;
export type NgtMatrix3 = THREE.Matrix3 | Parameters<THREE.Matrix3['set']>;
export type NgtMatrix4 = THREE.Matrix4 | Parameters<THREE.Matrix4['set']>;
export type NgtVector2 =
  | THREE.Vector2
  | Parameters<THREE.Vector2['set']>
  | Parameters<THREE.Vector2['setScalar']>[0]
  | NgtDouble;
export type NgtVector3 =
  | THREE.Vector3
  | Parameters<THREE.Vector3['set']>
  | Parameters<THREE.Vector3['setScalar']>[0]
  | NgtTriple;
export type NgtVector4 =
  | THREE.Vector4
  | Parameters<THREE.Vector4['set']>
  | Parameters<THREE.Vector4['setScalar']>[0]
  | NgtQuadruple;
export type NgtLayers = THREE.Layers | Parameters<THREE.Layers['set']>[0];
export type NgtQuaternion = THREE.Quaternion | Parameters<THREE.Quaternion['set']> | NgtQuadruple;

export type NgtColor = ConstructorParameters<typeof THREE.Color> | THREE.ColorRepresentation;

export type NgtFog = THREE.Fog | ConstructorParameters<typeof THREE.Fog>;
export type NgtFogExp2 = THREE.FogExp2 | ConstructorParameters<typeof THREE.FogExp2>;

export type NgtExtendedColors<T> = {
  [K in keyof T]: T[K] extends THREE.Color | undefined ? NgtColor : T[K];
};

export interface NgtIntersection extends THREE.Intersection {
  /** The event source (the object which registered the handler) */
  eventObject: THREE.Object3D;
}

export interface NgtIntersectionEvent<TSourceEvent> extends NgtIntersection {
  /** An array of intersections */
  intersections: NgtIntersection[];
  /** If the event was stopped by calling stopPropagation */
  stopped: boolean;
  /** vec3.set(pointer.x, pointer.y, 0).unproject(camera) */
  unprojectedPoint: THREE.Vector3;
  /** Normalized event coordinates */
  pointer: THREE.Vector2;
  /** Delta between first click and this event */
  delta: number;
  /** The ray that pierced it */
  ray: THREE.Ray;
  /** The camera that was used by the raycaster */
  camera: THREE.Camera;
  /** stopPropagation will stop underlying handlers from firing */
  stopPropagation: () => void;
  /** The original host event */
  nativeEvent: TSourceEvent;
}
export type NgtEvent<TEvent> = NgtIntersectionEvent<TEvent>;
export type NgtDomEvent = PointerEvent | MouseEvent | WheelEvent;

export type NgtEvents = {
  click: EventListener;
  contextmenu: EventListener;
  dblclick: EventListener;
  wheel: EventListener;
  pointerdown: EventListener;
  pointerup: EventListener;
  pointerleave: EventListener;
  pointermove: EventListener;
  pointercancel: EventListener;
  lostpointercapture: EventListener;
};

export type NgtFilterFunction = (items: THREE.Intersection[], state: NgtState) => THREE.Intersection[];
export type NgtComputeFunction = (event: NgtDomEvent, root: NgtState, previous?: NgtState) => void;

export interface NgtEventManager<TTarget = any> {
  /** Determines if the event layer is active */
  enabled: boolean;
  /** Event layer priority, higher prioritized layers come first and may stop(-propagate) lower layer  */
  priority: number;
  /** The compute function needs to set up the raycaster and an xy- pointer  */
  compute?: NgtComputeFunction;
  /** The filter can re-order or re-structure the intersections  */
  filter?: NgtFilterFunction;
  /** The target node the event layer is tied to */
  connected?: TTarget;
  /** All the pointer event handlers through which the host forwards native events */
  handlers?: NgtEvents;
  /** Allows re-connecting to another target */
  connect?: (target: TTarget) => void;
  /** Removes all existing events handlers from the target */
  disconnect?: () => void;
}

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

export interface NgtPointerCaptureTarget {
  intersection: NgtIntersection;
  target: Element;
}

export interface NgtNodeProps<P> {
  attach?: string[];
  /** Constructor arguments */
  args?: NgtArgs<P>;
}

export type NgtNode<T, P> = NgtExtendedColors<Overwrite<Partial<T>, NgtNodeProps<P>>>;

export type NgtObject3dNode<T, P> = Overwrite<
  NgtNode<T, P>,
  {
    position?: NgtVector3;
    up?: NgtVector3;
    scale?: NgtVector3;
    rotation?: NgtEuler;
    matrix?: NgtMatrix4;
    quaternion?: NgtQuaternion;
    layers?: NgtLayers;
    dispose?: (() => void) | null;
  }
> &
  NgtEventHandlers;

export type NgtCamera = THREE.PerspectiveCamera | THREE.OrthographicCamera;

export type NgtCameraOptions = (
  | NgtCamera
  | Partial<
      NgtObject3dNode<THREE.Camera, typeof THREE.Camera> &
        NgtObject3dNode<THREE.PerspectiveCamera, typeof THREE.PerspectiveCamera> &
        NgtObject3dNode<THREE.OrthographicCamera, typeof THREE.OrthographicCamera>
    >
) & { manual?: boolean };

export type NgtSceneOptions = Overwrite<
  Partial<Omit<THREE.Scene, 'isScene' | 'onBeforeRender' | 'onAfterRender' | 'type'>>,
  {
    position?: NgtVector3;
    up?: NgtVector3;
    scale?: NgtVector3;
    rotation?: NgtEuler;
    matrix?: NgtMatrix4;
    quaternion?: NgtQuaternion;
    layers?: NgtLayers;
    dispose?: (() => void) | null;
  }
>;

export type NgtGLOptions =
  | THREE.Renderer
  | ((canvas: HTMLCanvasElement) => THREE.Renderer)
  | Partial<Properties<THREE.WebGLRenderer> | THREE.WebGLRendererParameters>;

export type NgtDpr = number | [min: number, max: number];
export interface NgtSize {
  width: number;
  height: number;
}

export type NgtViewport = NgtSize & {
  /** The initial pixel ratio */
  initialDpr: number;
  /** Current pixel ratio */
  dpr: number;
  /** size.width / viewport.width */
  factor: number;
  /** Camera distance */
  distance: number;
  /** Camera aspect ratio: width / height */
  aspect: number;
};

export type NgtCurrentViewport = Omit<NgtViewport, 'dpr' | 'initialDpr'>;

export interface NgtRenderState extends NgtState {
  delta: number;
  frame?: THREE.XRFrame;
}

/* Animation */

export type NgtBeforeRenderCallback<TObject> = (state: NgtRenderState, obj: TObject) => void;

export interface NgtBeforeRenderRecord {
  obj?: THREE.Object3D | Ref;
  callback: NgtBeforeRenderCallback<THREE.Object3D | undefined>;
  priority?: number;
}

export interface NgtPerformanceOptions {
  current?: number;
  min?: number;
  max?: number;
  debounce?: number;
}

export interface NgtPerformance extends NgtPerformanceOptions {
  regress: () => void;
}

/* Store states */
export type NgtInternalState = {
  active: boolean;
  priority: number;
  frames: number;
  lastEvent: NgtDomEvent | null;
  interaction: THREE.Object3D[];
  hovered: Map<string, NgtEvent<NgtDomEvent>>;
  capturedMap: Map<number, Map<THREE.Object3D, NgtPointerCaptureTarget>>;
  initialClick: [x: number, y: number];
  initialHits: THREE.Object3D[];
  animations: Map<string, NgtBeforeRenderRecord>;
  subscribers: NgtBeforeRenderRecord[];
};

export interface NgtState {
  ready: boolean;
  raycasterOptions: Partial<THREE.Raycaster>;
  cameraOptions: NgtCameraOptions;
  sceneOptions: NgtSceneOptions;
  glOptions: NgtGLOptions;
  /* WebGLRenderer instance */
  gl: THREE.WebGLRenderer;
  /* initial look at instead of default */
  lookAt?: THREE.Vector3;
  /* default camera */
  camera: NgtCamera & { manual?: boolean };
  /* default camera ref */
  cameraRef: Ref<NgtCamera & { manual?: boolean }>;
  /* default scene */
  scene: THREE.Scene;
  /* default scene ref */
  sceneRef: Ref<THREE.Scene>;
  /* default raycaster */
  raycaster: THREE.Raycaster;
  /** Default clock */
  clock: THREE.Clock;
  /** Event layer interface, contains the event handler and the node they're connected to */
  events: NgtEventManager;
  /** XR interface */
  xr: { connect: () => void; disconnect: () => void };
  /** Currently used controls */
  controls: THREE.EventDispatcher | null;
  /** Normalized event coordinates */
  pointer: THREE.Vector2;
  /** @deprecated Normalized event coordinates, use "pointer" instead! */
  mouse: THREE.Vector2;
  /* Whether to enable r139's THREE.ColorManagement.legacyMode */
  legacy: boolean;
  /** Shortcut to gl.outputEncoding = LinearEncoding */
  linear: boolean;
  /** Shortcut to gl.toneMapping = NoTonemapping */
  flat: boolean;
  /** Shortcut to gl.shadowMap */
  shadows: boolean | Partial<THREE.WebGLShadowMap>;
  /** Render loop flags */
  frameloop: 'always' | 'demand' | 'never';
  /** Whether to initialize an OrthographicCamera instead */
  orthographic: boolean;
  /** Adaptive performance interface */
  performance: NgtPerformance;
  /** Reactive dpr of the canvas */
  dpr: NgtDpr;
  /** Reactive pixel-size of the canvas */
  size: NgtSize;
  /** Reactive size of the viewport in threejs units */
  viewport: NgtViewport & {
    getCurrentViewport: (
      camera?: NgtCamera,
      target?: THREE.Vector3 | Parameters<THREE.Vector3['set']>,
      size?: NgtSize
    ) => NgtCurrentViewport;
  };
  /** When the canvas was clicked but nothing was hit */
  pointerMissed?: (event: MouseEvent) => void;
  /** Flags the canvas for render, but doesn't render in itself */
  invalidate: () => void;
  /** Advance (render) one step */
  advance: (timestamp: number, runGlobalCallbacks?: boolean) => void;
  /** If this state model is layerd (via createPortal) then this contains the previous layer */
  previousState?: NgtState;
  /** Internals */
  internal: NgtInternalState;
}

export interface NgtInstanceInternal {
  root: () => NgtState;
  // objects and parent are used when children are added with `attach` instead of being added to the Object3D scene graph
  objects: Ref<Ref[]>;
  parent: Ref<NgtUnknownInstance> | null;
  primitive?: boolean;
  eventCount: number;
  handlers: Partial<NgtEventHandlers>;
  previousAttach?: string[] | (() => void);
  previousAttachValue?: unknown;
}

export type AttachFunction = (parent: Ref, child: Ref) => void | (() => void);

export type NgtUnknownInstance<TInstance = UnknownRecord> = TInstance & {
  __ngt__: NgtInstanceInternal;
};

export interface NgtObjectMap {
  nodes: { [name: string]: THREE.Object3D };
  materials: { [name: string]: THREE.Material };
}
