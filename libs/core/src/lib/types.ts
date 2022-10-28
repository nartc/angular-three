import { ElementRef } from '@angular/core';
import * as THREE from 'three';
import type { NgtRef } from './ref';

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
export type AnyConstructor<TObject = any> = new (...args: any[]) => TObject;
export type AnyAbstractConstructor<TObject = any> = abstract new (
  ...args: any[]
) => TObject;
export type AnyCtor<TObject = any> =
  | AnyConstructor<TObject>
  | AnyAbstractConstructor<TObject>;
export type Properties<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]
>;
export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export type Overwrite<T, O> = Omit<T, NonFunctionKeys<O>> & O;

/**
 * If **T** contains a constructor, @see ConstructorParameters must be used, otherwise **T**.
 */
type NgtArgs<T> = T extends new (...args: any) => any
  ? ConstructorParameters<T>
  : T;

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
export type NgtQuaternion =
  | THREE.Quaternion
  | Parameters<THREE.Quaternion['set']>
  | NgtQuadruple;
export type NgtColor =
  | ConstructorParameters<typeof THREE.Color>
  | THREE.ColorRepresentation;
export type NgtExtendedColors<T> = {
  [K in keyof T]: T[K] extends THREE.Color | undefined ? NgtColor : T[K];
};

export interface NgtNodeProps<P> {
  attach?: string[];
  /** Constructor arguments */
  args?: NgtArgs<P>;
}

export type NgtNode<T, P> = NgtExtendedColors<
  Overwrite<Partial<T>, NgtNodeProps<P>>
>;
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

export interface NgtIntersection extends THREE.Intersection {
  /** The event source (the object which registered the handler) */
  eventObject: THREE.Object3D;
}

export type NgtRenderer = {
  render: (scene: THREE.Scene, camera: THREE.Camera) => any;
};
export type NgtCamera = THREE.OrthographicCamera | THREE.PerspectiveCamera;

export type NgtDomEvent = PointerEvent | MouseEvent | WheelEvent;
export interface NgtIntersectionEvent<TSourceEvent> extends NgtIntersection {
  /** An array of intersections */
  intersections: NgtIntersection[];
  /** vec3.set(pointer.x, pointer.y, 0).unproject(camera) */
  unprojectedPoint: THREE.Vector3;
  /** Normalized event coordinates (x: [-1, 1], y: [-1, 1]) */
  pointer: THREE.Vector2;
  /** delta between first click and this event */
  delta: number;
  /** the ray casted from the camera */
  ray: THREE.Ray;
  /** the camera used to raycast */
  camera: NgtCamera;
  /** stopPropagation will stop underlying handlers from firing */
  stopPropagation: () => void;
  /** the original event */
  nativeEvent: TSourceEvent;
  /** if the event was stopped by calling stopPropagation */
  stopped: boolean;
}

export interface NgtPointerCaptureTarget {
  intersection: NgtIntersection;
  target: Element;
}

export type NgtThreeEvent<TEvent> = NgtIntersectionEvent<TEvent>;

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

export type FilterFunction = (
  items: THREE.Intersection[],
  stateGetter: NgtStateGetter
) => THREE.Intersection[];
export type ComputeFunction = (
  event: NgtDomEvent,
  rootGetter: NgtStateGetter,
  previousGetter?: NgtStateGetter
) => void;

export interface NgtEventManager<TTarget> {
  /** Determines if the event layer is active */
  enabled: boolean;
  /** Event layer priority, higher prioritized layers come first and may stop(-propagate) lower layer  */
  priority: number;
  /** The compute function needs to set up the raycaster and an xy- pointer  */
  compute?: ComputeFunction;
  /** The filter can re-order or re-structure the intersections  */
  filter?: FilterFunction;
  /** The target node the event layer is tied to */
  connected?: TTarget;
  /** All the pointer event handlers through which the host forwards native events */
  handlers?: NgtEvents;
  /** Allows re-connecting to another target */
  connect?: (target: TTarget) => void;
  /** Removes all existing events handlers from the target */
  disconnect?: () => void;
}

export interface NgtInternalState {
  active: boolean;
  priority: number;
  frames: number;
  lastEvent: NgtDomEvent | null;
  interaction: THREE.Object3D[];
  hovered: Map<string, NgtThreeEvent<NgtDomEvent>>;
  animations: Map<string, NgtBeforeRenderRecord>;
  subscribers: NgtBeforeRenderRecord[];
  capturedMap: Map<number, Map<THREE.Object3D, NgtPointerCaptureTarget>>;
  initialClick: [x: number, y: number];
  initialHits: THREE.Object3D[];
}

export type NgtDpr = number | [min: number, max: number];
export interface NgtSize {
  width: number;
  height: number;
  top: number;
  left: number;
  updateStyle?: boolean;
}

export interface NgtViewport extends NgtSize {
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
}

export interface NgtPerformanceOptions {
  current?: number;
  min?: number;
  max?: number;
  debounce?: number;
}

export interface NgtPerformance extends Required<NgtPerformanceOptions> {
  regress: () => void;
}

export interface NgtState {
  ready: boolean;
  /** Render loop flags */
  frameloop: 'always' | 'demand' | 'never';
  /* WebGLRenderer instance */
  gl: THREE.WebGLRenderer;
  /** Default camera */
  camera: NgtCamera & { manual?: boolean };
  cameraRef: NgtRef<NgtCamera & { manual?: boolean }>;
  /** Default scene */
  scene: THREE.Scene;
  sceneRef: NgtRef<THREE.Scene>;
  /** Normalized event coordinates */
  pointer: THREE.Vector2;
  /** Default raycaster */
  raycaster: THREE.Raycaster;
  /** Default clock */
  clock: THREE.Clock;
  /** Reactive pixel-size of the canvas */
  size: NgtSize;
  /** Reactive size of the viewport in threejs units */
  viewport: NgtViewport & {
    getCurrentViewport: (
      camera?: NgtCamera,
      target?: THREE.Vector3 | Parameters<THREE.Vector3['set']>,
      size?: NgtSize
    ) => Omit<NgtViewport, 'dpr' | 'initialDpr'>;
  };
  /** Adaptive performance interface */
  performance: NgtPerformance;
  /* Whether to enable r139's THREE.ColorManagement.legacyMode */
  legacy: boolean;
  /** Shortcut to gl.outputEncoding = LinearEncoding */
  linear: boolean;
  /** Shortcut to gl.toneMapping = NoTonemapping */
  flat: boolean;
  /** Event layer interface, contains the event handler and the node they're connected to */
  events: NgtEventManager<any>;
  /** Currently used controls */
  controls: THREE.EventDispatcher | null;
  /** XR interface */
  xr: { connect: () => void; disconnect: () => void };
  /** When the canvas was clicked but nothing was hit */
  onPointerMissed?: (event: MouseEvent) => void;
  /* internals */
  internal: NgtInternalState;
  /** If this state model is layerd (via createPortal) then this contains the previous layer */
  previousRoot?: NgtStateGetter;
  /** Flags the canvas for render, but doesn't render in itself */
  invalidate: (frames?: number) => void;
  /** Advance (render) one step */
  advance: (timestamp: number, runGlobalCallbacks?: boolean) => void;
  setPerformanceCurrent: (current: number) => void;
  setEvents: (events: Partial<NgtEventManager<any>>) => void;
  setFrameloop: (frameloop: NgtState['frameloop']) => void;
  setSize: (
    width: number,
    height: number,
    top?: number,
    left?: number,
    updateStyle?: boolean
  ) => void;
  setDpr: (dpr: NgtDpr) => void;
  setCamera: (camera: NgtCamera) => void;
}

export type NgtStateGetter = () => NgtState;

export interface NgtRenderState extends NgtState {
  delta: number;
  frame?: XRFrame;
}

export type NgtBeforeRenderCallback<TObject> = (
  state: NgtRenderState,
  obj: TObject
) => void;

export interface NgtBeforeRenderRecord {
  obj?: THREE.Object3D | NgtRef;
  callback: NgtBeforeRenderCallback<THREE.Object3D | undefined>;
  priority?: number;
}

export interface NgtInstanceLocalState {
  /** the state getter of the canvas that the instance is being rendered to */
  stateGetter: NgtStateGetter;
  objects: NgtRef<NgtRef[]>;
  parent: NgtRef<NgtInstanceNode> | null;
  primitive?: boolean;
  eventCount: number;
  handlers: Partial<NgtEventHandlers>;
  previousAttach?: string[] | (() => void);
  previousAttachValue?: unknown;
}

export type NgtInstanceNode<TNode = any> = TNode & {
  __ngt__: NgtInstanceLocalState;
  [key: string]: any;
};

export type NgtGLOptions =
  | NgtRenderer
  | ((canvas: HTMLCanvasElement) => NgtRenderer)
  | Partial<Properties<THREE.WebGLRenderer> | THREE.WebGLRendererParameters>
  | undefined;

export interface NgtCanvasInputs {
  /** A threejs renderer instance or props that go into the default renderer */
  gl?: NgtGLOptions;
  /** Dimensions to fit the renderer to. Will measure canvas dimensions if omitted */
  size?: NgtSize;
  /**
   * Enables PCFsoft shadows. Can accept `gl.shadowMap` options for fine-tuning.
   * @see https://threejs.org/docs/#api/en/renderers/WebGLRenderer.shadowMap
   */
  shadows?: boolean | Partial<THREE.WebGLShadowMap>;
  /**
   * Disables three r139 color management.
   * @see https://threejs.org/docs/#manual/en/introduction/Color-management
   */
  legacy?: boolean;
  /** Switch off automatic sRGB encoding and gamma correction */
  linear?: boolean;
  /** Use `THREE.NoToneMapping` instead of `THREE.ACESFilmicToneMapping` */
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
  performance?: NgtPerformanceOptions;
  /** Target pixel ratio. Can clamp between a range: `[min, max]` */
  dpr?: NgtDpr;
  /** Props that go into the default raycaster */
  raycaster?: Partial<THREE.Raycaster>;
  /** A `THREE.Camera` instance or props that go into the default camera */
  camera?: (
    | NgtCamera
    | Partial<
        NgtObject3dNode<THREE.Camera, typeof THREE.Camera> &
          NgtObject3dNode<
            THREE.PerspectiveCamera,
            typeof THREE.PerspectiveCamera
          > &
          NgtObject3dNode<
            THREE.OrthographicCamera,
            typeof THREE.OrthographicCamera
          >
      >
  ) & {
    /** Flags the camera as manual, putting projection into your own hands */
    manual?: boolean;
  };
  /** An R3F event manager to manage elements' pointer events */
  events?: (stateGetter: NgtStateGetter) => NgtEventManager<HTMLElement>;
  /** The target where events are being subscribed to, default: the div that wraps canvas */
  eventSource?: HTMLElement | ElementRef<HTMLElement>;
  /** The event prefix that is cast into canvas pointer x/y events, default: "offset" */
  eventPrefix?: 'offset' | 'client' | 'page' | 'layer' | 'screen';
  /** Default coordinate for the camera to look at */
  lookAt?: THREE.Vector3;
}
