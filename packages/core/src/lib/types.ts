import type { ElementRef, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type {
  Camera,
  Clock,
  Color,
  ColorRepresentation,
  Euler,
  EventDispatcher,
  Intersection,
  Layers,
  Loader,
  Material,
  Matrix4,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Quaternion,
  Ray,
  Raycaster,
  Scene,
  Vector,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
  WebGLRendererParameters,
  WebGLShadowMap,
} from 'three';
import type { NgtRxStore } from './stores/rx-store';

export type NgtAnyRecord = Record<string, any>;
export type NgtAnyFunction<TReturn = any> = (...args: any[]) => TReturn;
export type NgtAnyConstructor<TObject = any> = new (...args: any[]) => TObject;
export type NgtProperties<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]
>;
export type NgtNonFunctionKeys<T> = {
  [K in keyof T]-?: T[K] extends Function ? never : K;
}[keyof T];
export type NgtOverwrite<T, O> = Omit<T, NgtNonFunctionKeys<O>> & O;

export type NgtEquConfig = {
  /** Compare arrays by reference equality a === b (default), or by shallow equality */
  arrays?: 'reference' | 'shallow';
  /** Compare objects by reference equality a === b (default), or by shallow equality */
  objects?: 'reference' | 'shallow';
  /** If true the keys in both a and b must match 1:1 (default), if false a's keys must intersect b's */
  strict?: boolean;
};

export type NgtEuler = Euler | Parameters<Euler['set']>;
export type NgtMatrix4 = Matrix4 | Parameters<Matrix4['set']> | Readonly<Matrix4['set']>;

/**
 * Turn an implementation of Vector in to the type that an r3f component would accept as a prop.
 */
type NgtVectorLike<VectorClass extends Vector> =
  | VectorClass
  | Parameters<VectorClass['set']>
  | Readonly<Parameters<VectorClass['set']>>
  | Parameters<VectorClass['setScalar']>[0];

export type NgtVector2 = NgtVectorLike<Vector2>;
export type NgtVector3 = NgtVectorLike<Vector3>;
export type NgtVector4 = NgtVectorLike<Vector4>;
export type NgtColorArray = typeof Color | Parameters<Color['set']>;
export type NgtLayers = Layers | Parameters<Layers['set']>[0];
export type NgtQuaternion = Quaternion | Parameters<Quaternion['set']>;

export interface NgtIntersection extends Intersection {
  /** The event source (the object which registered the handler) */
  eventObject: Object3D;
}

export interface NgtPointerCaptureTarget {
  intersection: NgtIntersection;
  target: Element;
}

export type NgtCamera = OrthographicCamera | PerspectiveCamera;
export type NgtCameraManual = NgtCamera & { manual?: boolean };

export interface NgtIntersectionEvent<TSourceEvent> extends NgtIntersection {
  /** The event source (the object which registered the handler) */
  eventObject: Object3D;
  /** An array of intersections */
  intersections: NgtIntersection[];
  /** vec3.set(pointer.x, pointer.y, 0).unproject(camera) */
  unprojectedPoint: Vector3;
  /** Normalized event coordinates */
  pointer: Vector2;
  /** Delta between first click and this event */
  delta: number;
  /** The ray that pierced it */
  ray: Ray;
  /** The camera that was used by the raycaster */
  camera: NgtCamera;
  /** stopPropagation will stop underlying handlers from firing */
  stopPropagation: () => void;
  /** The original host event */
  nativeEvent: TSourceEvent;
  /** If the event was stopped by calling stopPropagation */
  stopped: boolean;
}

export type NgtThreeEvent<TEvent> = NgtIntersectionEvent<TEvent> & NgtProperties<TEvent>;
export type NgtDomEvent = PointerEvent | MouseEvent | WheelEvent;

export interface NgtEvents {
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
}

export interface NgtEventHandlers {
  click?: (event: NgtThreeEvent<MouseEvent>) => void;
  contextmenu?: (event: NgtThreeEvent<MouseEvent>) => void;
  dblclick?: (event: NgtThreeEvent<MouseEvent>) => void;
  pointerup?: (event: NgtThreeEvent<PointerEvent>) => void;
  pointerdown?: (event: NgtThreeEvent<PointerEvent>) => void;
  pointerover?: (event: NgtThreeEvent<PointerEvent>) => void;
  pointerout?: (event: NgtThreeEvent<PointerEvent>) => void;
  pointerenter?: (event: NgtThreeEvent<PointerEvent>) => void;
  pointerleave?: (event: NgtThreeEvent<PointerEvent>) => void;
  pointermove?: (event: NgtThreeEvent<PointerEvent>) => void;
  pointermissed?: (event: MouseEvent) => void;
  pointercancel?: (event: NgtThreeEvent<PointerEvent>) => void;
  wheel?: (event: NgtThreeEvent<WheelEvent>) => void;
}

export type NgtFilterFunction = (
  items: Intersection[],
  store: NgtRxStore<NgtState>
) => Intersection[];

export type NgtComputeFunction = (
  event: NgtDomEvent,
  root: NgtRxStore<NgtState>,
  previous?: NgtRxStore<NgtState>
) => void;

export interface NgtEventManager<TTarget> {
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

export interface NgtPerformance {
  /** Current performance normal, between min and max */
  current: number;
  /** How low the performance can go, between 0 and max */
  min: number;
  /** How high the performance can go, between min and max */
  max: number;
  /** Time until current returns to max in ms */
  debounce: number;
  /** Sets current to min, puts the system in regression */
  regress: () => void;
}

export type NgtDpr = number | [min: number, max: number];
export type NgtSize = {
  width: number;
  height: number;
  top: number;
  left: number;
  updateStyle?: boolean;
};
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

export interface NgtRenderState extends NgtState {
  delta: number;
  frame?: XRFrame;
}

export interface NgtBeforeRender<TObject extends NgtInstanceNode = NgtInstanceNode> {
  state: NgtRenderState;
  object: TObject;
}

export type NgtBeforeRenderCallback<TObject extends NgtInstanceNode = NgtInstanceNode> = (
  state: NgtRenderState,
  obj: TObject
) => void;

export interface NgtBeforeRenderRecord {
  callback: NgtBeforeRenderCallback;
  store: NgtRxStore<NgtState>;
  obj?: NgtInstanceNode;
  priority?: number;
}

export interface NgtInternalState {
  active: boolean;
  priority: number;
  frames: number;
  lastEvent: NgtDomEvent;
  interaction: Object3D[];
  hovered: Map<string, NgtThreeEvent<NgtDomEvent>>;
  subscribers: NgtBeforeRenderRecord[];
  capturedMap: Map<number, Map<Object3D, NgtPointerCaptureTarget>>;
  initialClick: [x: number, y: number];
  initialHits: Object3D[];
  subscribe: (
    callback: NgtBeforeRenderCallback,
    priority?: number,
    store?: NgtRxStore<NgtState>,
    obj?: NgtInstanceNode
  ) => () => void;
}

export interface NgtState {
  /** Set current state */
  set: NgtRxStore<NgtState>['set'];
  /** Get current state */
  get: NgtRxStore<NgtState>['get'];
  select: NgtRxStore<NgtState>['select'];
  /** canvas ready state */
  ready: boolean;
  /** The instance of the renderer */
  gl: WebGLRenderer;
  /** Default camera */
  camera: NgtCamera & { manual?: boolean };
  /** Default scene */
  scene: Scene;
  /** Default raycaster */
  raycaster: Raycaster;
  /** Default clock */
  clock: Clock;
  /** Event layer interface, contains the event handler and the node they're connected to */
  events: NgtEventManager<any>;
  /** XR interface */
  xr: { connect: () => void; disconnect: () => void };
  /** Currently used controls */
  controls: EventDispatcher | null;
  /** Normalized event coordinates */
  pointer: Vector2;
  /* Whether to enable r139's ColorManagement.legacyMode */
  legacy: boolean;
  /** Shortcut to gl.outputEncoding = LinearEncoding */
  linear: boolean;
  /** Shortcut to gl.toneMapping = NoTonemapping */
  flat: boolean;
  /** Render loop flags */
  frameloop: 'always' | 'demand' | 'never';
  /** Adaptive performance interface */
  performance: NgtPerformance;
  /** Reactive pixel-size of the canvas */
  size: NgtSize;
  /** Reactive size of the viewport in threejs units */
  viewport: NgtViewport & {
    getCurrentViewport: (
      camera?: NgtCameraManual,
      target?: Vector3 | Parameters<Vector3['set']>,
      size?: NgtSize
    ) => Omit<NgtViewport, 'dpr' | 'initialDpr'>;
  };
  /** Flags the canvas for render, but doesn't render in itself */
  invalidate: (frames?: number) => void;
  /** Advance (render) one step */
  advance: (timestamp: number, runGlobalEffects?: boolean) => void;
  /** Shortcut to setting the event layer */
  setEvents: (events: Partial<NgtEventManager<any>>) => void;
  /**
   * Shortcut to manual sizing
   */
  setSize: (
    width: number,
    height: number,
    top?: number,
    left?: number,
    updateStyle?: boolean
  ) => void;
  /** Shortcut to manual setting the pixel ratio */
  setDpr: (dpr: NgtDpr) => void;
  /** Shortcut to frameloop flags */
  setFrameloop: (frameloop?: 'always' | 'demand' | 'never') => void;
  /** When the canvas was clicked but nothing was hit */
  onPointerMissed?: (event: MouseEvent) => void;
  /** If this state model is layerd (via createPortal) then this contains the previous layer */
  previousStore?: NgtRxStore<NgtState>;
  /** Internals */
  internal: NgtInternalState;
  addInteraction: (interaction: Object3D) => void;
  removeInteraction: (uuid: string) => void;
}

export type NgtAttachFunction<TChild = any, TParent = any> = (
  parent: TParent,
  child: TChild,
  store: NgtRxStore<NgtState>
) => void | (() => void);

export type NgtAfterAttach<TParent extends NgtInstanceNode = NgtInstanceNode, TChild extends NgtInstanceNode = NgtInstanceNode> = {
    parent: TParent;
    node: TChild;
}

export interface NgtInstanceLocalState {
  /** the state getter of the canvas that the instance is being rendered to */
  store: NgtRxStore<NgtState>;
  // objects and parent are used when children are added with `attach` instead of being added to the Object3D scene graph
  nonObjects: BehaviorSubject<NgtInstanceNode[]>;
  // objects that are Object3D
  objects: BehaviorSubject<NgtInstanceNode[]>;
  // shortcut to add object to list
  addObject: (instance: NgtInstanceNode) => void;
  // shortcut to remove object form list
  removeObject: (instance: NgtInstanceNode) => void;
  // shortcut to add non object to list
  addNonObject: (instance: NgtInstanceNode) => void;
  // short cut to remove non object from list
  removeNonObject: (instanct: NgtInstanceNode) => void;
  parent: NgtInstanceNode | null;
  // if this THREE instance is a ngt-primitive
  primitive?: boolean;
  // if this THREE object has any events bound to it
  eventCount: number;
  // list of handlers to handle the events
  handlers: Partial<NgtEventHandlers>;
  // previous args
  args?: unknown[];
  // attach information so that we can detach as well as reset
  attach?: string[] | NgtAttachFunction;
  // previously attach information so we can reset as well as clean up
  previousAttach?: unknown | (() => void);
  // memoized props
  memoized?: NgtAnyRecord;
  // is raw value
  isRaw?: boolean;
  // priority for before render
  priority?: number;
  // update emitter after props update
  afterUpdate?: EventEmitter<NgtInstanceNode>;
  // update emitter after props update
  afterAttach?: EventEmitter<NgtAfterAttach>;
}

export type NgtInstanceNode<TNode = any> = TNode & {
  __ngt__: NgtInstanceLocalState;
} & NgtAnyRecord;

export type NgtGLRenderer = {
  render: (scene: Scene, camera: Camera) => void;
};

export type NgtGLOptions =
  | NgtGLRenderer
  | ((canvas: HTMLCanvasElement) => NgtGLRenderer)
  | Partial<NgtProperties<WebGLRenderer> | WebGLRendererParameters>
  | undefined;

export type NgtExtendedColors<T> = {
  [K in keyof T]: T[K] extends Color | undefined ? ColorRepresentation : T[K];
};

/**
 * If **T** contains a constructor, @see ConstructorParameters must be used, otherwise **T**.
 */
export type NgtNodeArgs<T> = T extends new (...args: any) => any ? ConstructorParameters<T> : T;

export interface NgtNodeProps<P> {
  attach?: string[];
  /** Constructor arguments */
  args?: NgtNodeArgs<P>;
}

export type NgtNode<T, P> = NgtExtendedColors<NgtOverwrite<Partial<T>, NgtNodeProps<P>>>;
export type NgtObject3DNode<T, P> = NgtOverwrite<
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

export type NgtConditionalType<Child, Parent, Truthy, Falsy> = Child extends Parent
  ? Truthy
  : Falsy;

export interface NgtLoaderProto<T> extends Loader {
  load(
    url: string | string[],
    onLoad?: (result: T) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void
  ): unknown;
}

export interface NgtLoaderExtensions {
  (loader: Loader): void;
}

export type NgtLoaderResult<T> = T extends any[] ? NgtLoaderProto<T[number]> : NgtLoaderProto<T>;
export type NgtBranchingReturn<T = any, Parent = any, Coerced = any> = NgtConditionalType<
  T,
  Parent,
  Coerced,
  T
>;

export interface NgtObjectMap {
  nodes: { [name: string]: Object3D };
  materials: { [name: string]: Material };
  [key: string]: any;
}

export interface NgtCanvasInputs {
  /** A threejs renderer instance or props that go into the default renderer */
  gl?: NgtGLOptions;
  /** Dimensions to fit the renderer to. Will measure canvas dimensions if omitted */
  size?: NgtSize;
  /**
   * Enables PCFsoft shadows. Can accept `gl.shadowMap` options for fine-tuning.
   * @see https://threejs.org/docs/#api/en/renderers/WebGLRenderer.shadowMap
   */
  shadows?: boolean | Partial<WebGLShadowMap>;
  /**
   * Disables three r139 color management.
   * @see https://threejs.org/docs/#manual/en/introduction/Color-management
   */
  legacy?: boolean;
  /** Switch off automatic sRGB encoding and gamma correction */
  linear?: boolean;
  /** Use `NoToneMapping` instead of `ACESFilmicToneMapping` */
  flat?: boolean;
  /** Creates an orthographic camera */
  orthographic?: boolean;
  /**
   * R3F's render mode. Set to `demand` to only render on state change or `never` to take control.
   * @see https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#on-demand-rendering
   */
  frameloop?: 'always' | 'demand' | 'never';
  /**
   * R3F performance options for adaptive performance.
   * @see https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#movement-regression
   */
  performance?: Partial<Omit<NgtPerformance, 'regress'>>;
  /** Target pixel ratio. Can clamp between a range: `[min, max]` */
  dpr?: NgtDpr;
  /** Props that go into the default raycaster */
  raycaster?: Partial<Raycaster>;
  /** A `Camera` instance or props that go into the default camera */
  camera?: (
    | NgtCamera
    | Partial<
        NgtObject3DNode<Camera, typeof Camera> &
          NgtObject3DNode<PerspectiveCamera, typeof PerspectiveCamera> &
          NgtObject3DNode<OrthographicCamera, typeof OrthographicCamera>
      >
  ) & {
    /** Flags the camera as manual, putting projection into your own hands */
    manual?: boolean;
  };
  /** An R3F event manager to manage elements' pointer events */
  events?: (store: NgtRxStore<NgtState>) => NgtEventManager<HTMLElement>;
  /** The target where events are being subscribed to, default: the div that wraps canvas */
  eventSource?: HTMLElement | ElementRef<HTMLElement>;
  /** The event prefix that is cast into canvas pointer x/y events, default: "offset" */
  eventPrefix?: 'offset' | 'client' | 'page' | 'layer' | 'screen';
  /** Default coordinate for the camera to look at */
  lookAt?: NgtVector3;
}

