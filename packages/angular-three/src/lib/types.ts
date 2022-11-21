import { ElementRef } from '@angular/core';
import { ObservableInput } from 'rxjs';
import * as THREE from 'three';
import { Renderer, WebGLRenderer, WebGLRendererParameters } from 'three';
import { NgtRef } from './ref';

export type NgtEquConfig = {
    /** Compare arrays by reference equality a === b (default), or by shallow equality */
    arrays?: 'reference' | 'shallow';
    /** Compare objects by reference equality a === b (default), or by shallow equality */
    objects?: 'reference' | 'shallow';
    /** If true the keys in both a and b must match 1:1 (default), if false a's keys must intersect b's */
    strict?: boolean;
};

export type NgtBooleanInput = string | boolean | null | undefined;
export type NgtNumberInput = string | number | null | undefined;
export type NgtObservableInput<T> = T | ObservableInput<T>;

export type NgtAnyRecord = Record<string, any>;
export type NgtAnyFunction<TReturn = any> = (...args: any[]) => TReturn;
export type NgtAnyConstructor<TObject = any> = new (...args: any[]) => TObject;
export type NgtAnyAbstractConstructor<TObject = any> = abstract new (...args: any[]) => TObject;
export type NgtAnyCtor<TObject = any> = NgtAnyConstructor<TObject> | NgtAnyAbstractConstructor<TObject>;
export type NgtProperties<T> = Pick<T, { [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]>;
export type NgtNonFunctionKeys<T> = { [K in keyof T]-?: T[K] extends Function ? never : K }[keyof T];
export type NgtOverwrite<T, O> = Omit<T, NgtNonFunctionKeys<O>> & O;

export type NgtDpr = number | [min: number, max: number];
export type NgtSize = { width: number; height: number; top: number; left: number; updateStyle?: boolean };
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

export type NgtPerformance = {
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

export interface NgtIntersection extends THREE.Intersection {
    /** The event source (the object which registered the handler) */
    eventObject: THREE.Object3D;
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

export type NgtConditionalType<Child, Parent, Truthy, Falsy> = Child extends Parent ? Truthy : Falsy;

export interface NgtLoaderProto<T> extends THREE.Loader {
    load(
        url: string | string[],
        onLoad?: (result: T) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void
    ): unknown;
}

export interface NgtLoaderExtensions {
    (loader: THREE.Loader): void;
}

export type NgtLoaderResult<T> = T extends any[] ? NgtLoaderProto<T[number]> : NgtLoaderProto<T>;
export type NgtBranchingReturn<T = any, Parent = any, Coerced = any> = NgtConditionalType<T, Parent, Coerced, T>;

export interface NgtObjectMap {
    nodes: { [name: string]: THREE.Object3D };
    materials: { [name: string]: THREE.Material };
    [key: string]: any;
}

/**
 * If **T** contains a constructor, @see ConstructorParameters must be used, otherwise **T**.
 */
export type NgtNodeArgs<T> = T extends new (...args: any) => any ? ConstructorParameters<T> : T;

/**
 * Turn an implementation of THREE.Vector in to the type that an r3f component would accept as a prop.
 */
type NgtVectorLike<VectorClass extends THREE.Vector> =
    | VectorClass
    | Parameters<VectorClass['set']>
    | Readonly<Parameters<VectorClass['set']>>
    | Parameters<VectorClass['setScalar']>[0];

export type NgtVector2 = NgtVectorLike<THREE.Vector2>;
export type NgtVector3 = NgtVectorLike<THREE.Vector3>;
export type NgtVector4 = NgtVectorLike<THREE.Vector4>;
export type NgtLayers = THREE.Layers | Parameters<THREE.Layers['set']>[0];
export type NgtQuaternion = THREE.Quaternion | Parameters<THREE.Quaternion['set']>;
export type NgtEuler = THREE.Euler | Parameters<THREE.Euler['set']>;
export type NgtMatrix4 = THREE.Matrix4 | Parameters<THREE.Matrix4['set']> | Readonly<THREE.Matrix4['set']>;

export type NgtColor = ConstructorParameters<typeof THREE.Color> | THREE.ColorRepresentation;

export type NgtExtendedColors<T> = {
    [K in keyof T]: T[K] extends THREE.Color | undefined ? NgtColor : T[K];
};

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

export type NgtCameraWithManual = NgtCamera & { manual?: boolean };

export interface NgtRenderState extends NgtState {
    delta: number;
    frame?: XRFrame;
}

export interface NgtBeforeRender<TObject extends THREE.Object3D = any> {
    state: NgtRenderState;
    object: TObject;
}

export type NgtBeforeRenderCallback<TObject = any> = (state: NgtRenderState, obj: TObject) => void;

export interface NgtBeforeRenderRecord {
    obj?: THREE.Object3D | NgtRef;
    callback: NgtBeforeRenderCallback<THREE.Object3D | undefined>;
    priority?: number;
    stateFactory: NgtStateFactory;
}

export interface NgtInternalState {
    active: boolean;
    priority: number;
    frames: number;
    lastEvent: NgtDomEvent | null;
    interaction: THREE.Object3D[];
    hovered: Map<string, NgtThreeEvent<NgtDomEvent>>;
    subscribers: NgtBeforeRenderRecord[];
    capturedMap: Map<number, Map<THREE.Object3D, NgtPointerCaptureTarget>>;
    initialClick: [x: number, y: number];
    initialHits: THREE.Object3D[];
    subscribe: (
        callback: NgtBeforeRenderCallback,
        priority: number,
        stateFactory: NgtStateFactory,
        obj?: THREE.Object3D | NgtRef
    ) => () => void;
}

export interface NgtState {
    /** The flag to notify if the Canvas is ready to render */
    ready: boolean;
    /** The instance of the renderer */
    gl: THREE.WebGLRenderer;
    /** Default camera */
    camera: NgtCameraWithManual /** Default scene */;
    cameraRef: NgtRef<NgtCameraWithManual>;
    scene: THREE.Scene;
    sceneRef: NgtRef<THREE.Scene>;
    /** Default raycaster */
    raycaster: THREE.Raycaster;
    /** Default clock */
    clock: THREE.Clock;
    /** Event layer interface, contains the event handler and the node they're connected to */
    events: NgtEventManager<any>;
    /** XR interface */
    xr: { connect: () => void; disconnect: () => void };
    /** Currently used controls */
    controls: THREE.EventDispatcher | null;
    /** Normalized event coordinates */
    pointer: THREE.Vector2;
    /* Whether to enable r139's THREE.ColorManagement.legacyMode */
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
            camera?: NgtCamera,
            target?: THREE.Vector3 | Parameters<THREE.Vector3['set']>,
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
    setSize: (width: number, height: number, top?: number, left?: number, updateStyle?: boolean) => void;
    /** Shortcut to manual setting the pixel ratio */
    setDpr: (dpr: NgtDpr) => void;
    /** Shortcut to frameloop flags */
    setFrameloop: (frameloop?: 'always' | 'demand' | 'never') => void;
    /** Shortcut to set performance.current for performance regressing */
    setPerformanceCurrent: (current: number) => void;
    /** Shortcut to set the current camera */
    setCamera: (camera: NgtCamera) => void;

    /** Shortcut to add an object as an Event interaction */
    addInteraction(interaction: THREE.Object3D): void;

    /** Shortcut to remove an object UUID from participating in Events */
    removeInteraction(uuid: string): void;

    /** When the canvas was clicked but nothing was hit */
    onPointerMissed?: (event: MouseEvent) => void;
    /* internals */
    internal: NgtInternalState;
    /** If this state model is layerd (via createPortal) then this contains the previous layer */
    previousStateFactory?: NgtStateFactory;
}

export type NgtStateFactory = () => NgtState;

export type NgtFilterFunction = (items: THREE.Intersection[], stateFactory: NgtStateFactory) => THREE.Intersection[];
export type NgtComputeFunction = (
    event: NgtDomEvent,
    rootStateFactory: NgtStateFactory,
    previousStateFactory?: NgtStateFactory
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

export type NgtAttachFunction<TChild = any, TParent = any> = (
    parent: NgtRef<TParent>,
    child: NgtRef<TChild>,
    stateFactory: NgtStateFactory
) => void | (() => void);

export interface NgtInstanceLocalState {
    /** the state getter of the canvas that the instance is being rendered to */
    stateFactory: NgtStateFactory;
    rootFactory: NgtStateFactory;
    // non-object 3d
    instancesRefs: NgtRef<NgtRef[]>;
    // object-3d
    objectsRefs: NgtRef<NgtRef[]>;
    parentRef: NgtRef<NgtInstanceNode> | null;
    isPrimitive?: boolean;
    isRaw?: boolean;
    eventCount: number;
    handlers: Partial<NgtEventHandlers>;
    args?: unknown[];
    attach?: string[] | (() => void);
    attachValue?: unknown;
    memoized?: NgtAnyRecord;
}

export type NgtInstanceNode<TNode = any> = TNode & {
    __ngt__: NgtInstanceLocalState;
    [key: string]: any;
};

export type NgtGLOptions =
    | Renderer
    | ((canvas: HTMLCanvasElement) => Renderer)
    | Partial<NgtProperties<WebGLRenderer> | WebGLRendererParameters>
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
    performance?: Partial<Omit<NgtPerformance, 'regress'>>;
    /** Target pixel ratio. Can clamp between a range: `[min, max]` */
    dpr?: NgtDpr;
    /** Props that go into the default raycaster */
    raycaster?: Partial<THREE.Raycaster>;
    /** A `THREE.Camera` instance or props that go into the default camera */
    camera?: (
        | NgtCamera
        | Partial<
              NgtObject3DNode<THREE.Camera, typeof THREE.Camera> &
                  NgtObject3DNode<THREE.PerspectiveCamera, typeof THREE.PerspectiveCamera> &
                  NgtObject3DNode<THREE.OrthographicCamera, typeof THREE.OrthographicCamera>
          >
    ) & {
        /** Flags the camera as manual, putting projection into your own hands */
        manual?: boolean;
    };
    /** An R3F event manager to manage elements' pointer events */
    events?: (stateFactory: NgtStateFactory) => NgtEventManager<HTMLElement>;
    /** The target where events are being subscribed to, default: the div that wraps canvas */
    eventSource?: HTMLElement | ElementRef<HTMLElement>;
    /** The event prefix that is cast into canvas pointer x/y events, default: "offset" */
    eventPrefix?: 'offset' | 'client' | 'page' | 'layer' | 'screen';
    /** Default coordinate for the camera to look at */
    lookAt?: THREE.Vector3;
}
