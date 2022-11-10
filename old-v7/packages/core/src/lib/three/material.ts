import { Directive, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';
import { Plane } from 'three/src/math/Plane';
import { NgtInstance, NgtInstanceState, provideNgtInstance } from '../abstracts/instance';
import { injectObjectHostRef, injectObjectRef } from '../di/three';
import type {
  NgtAnyConstructor,
  NgtBooleanInput,
  NgtNumberInput,
  NgtObservableInput,
  NgtPrepareInstanceFn,
} from '../types';
import { coerceBoolean, coerceNumber } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';

export interface NgtCommonMaterialState<TMaterial extends THREE.Material = THREE.Material>
  extends NgtInstanceState<TMaterial> {
  alphaTest?: number;
  alphaToCoverage?: boolean;
  blendDst?: THREE.BlendingDstFactor;
  blendDstAlpha?: number;
  blendEquation?: THREE.BlendingEquation;
  blendEquationAlpha?: number;
  blending?: THREE.Blending;
  blendSrc?: THREE.BlendingSrcFactor | THREE.BlendingDstFactor;
  blendSrcAlpha?: number;
  clipIntersection?: boolean;
  clippingPlanes?: Plane[];
  clipShadows?: boolean;
  colorWrite?: boolean;
  defines?: any;
  depthFunc?: THREE.DepthModes;
  depthTest?: boolean;
  depthWrite?: boolean;
  name?: string;
  opacity?: number;
  polygonOffset?: boolean;
  polygonOffsetFactor?: number;
  polygonOffsetUnits?: number;
  precision?: 'highp' | 'mediump' | 'lowp' | null;
  premultipliedAlpha?: boolean;
  dithering?: boolean;
  side?: THREE.Side;
  shadowSide?: THREE.Side;
  toneMapped?: boolean;
  transparent?: boolean;
  vertexColors?: boolean;
  visible?: boolean;
  format?: THREE.PixelFormat;
  stencilWrite?: boolean;
  stencilFunc?: THREE.StencilFunc;
  stencilRef?: number;
  stencilWriteMask?: number;
  stencilFuncMask?: number;
  stencilFail?: THREE.StencilOp;
  stencilZFail?: THREE.StencilOp;
  stencilZPass?: THREE.StencilOp;
  userData?: any;
}

@Directive()
export abstract class NgtCommonMaterial<TMaterial extends THREE.Material = THREE.Material> extends NgtInstance<
  TMaterial,
  NgtCommonMaterialState<TMaterial>
> {
  @Input() set alphaTest(alphaTest: NgtNumberInput) {
    this.set({ alphaTest: coerceNumber(alphaTest) });
  }

  @Input() set alphaToCoverage(alphaToCoverage: NgtBooleanInput) {
    this.set({ alphaToCoverage: coerceBoolean(alphaToCoverage) });
  }

  @Input() set blendDst(blendDst: THREE.BlendingDstFactor) {
    this.set({ blendDst });
  }

  @Input() set blendDstAlpha(blendDstAlpha: NgtNumberInput) {
    this.set({ blendDstAlpha: coerceNumber(blendDstAlpha) });
  }

  @Input() set blendEquation(blendEquation: THREE.BlendingEquation) {
    this.set({ blendEquation });
  }

  @Input() set blendEquationAlpha(blendEquationAlpha: NgtNumberInput) {
    this.set({
      blendEquationAlpha: coerceNumber(blendEquationAlpha),
    });
  }

  @Input() set blending(blending: THREE.Blending) {
    this.set({ blending });
  }

  @Input() set blendSrc(blendSrc: THREE.BlendingSrcFactor | THREE.BlendingDstFactor) {
    this.set({ blendSrc });
  }

  @Input() set blendSrcAlpha(blendSrcAlpha: NgtNumberInput) {
    this.set({ blendSrcAlpha: coerceNumber(blendSrcAlpha) });
  }

  @Input() set clipIntersection(clipIntersection: NgtBooleanInput) {
    this.set({ clipIntersection: coerceBoolean(clipIntersection) });
  }

  @Input() set clippingPlanes(clippingPlanes: Plane[]) {
    this.set({ clippingPlanes });
  }

  @Input() set clipShadows(clipShadows: NgtBooleanInput) {
    this.set({ clipShadows: coerceBoolean(clipShadows) });
  }

  @Input() set colorWrite(colorWrite: NgtBooleanInput) {
    this.set({ colorWrite: coerceBoolean(colorWrite) });
  }

  @Input() set defines(defines: any) {
    this.set({ defines });
  }

  @Input() set depthFunc(depthFunc: THREE.DepthModes) {
    this.set({ depthFunc });
  }

  @Input() set depthTest(depthTest: NgtBooleanInput) {
    this.set({ depthTest: coerceBoolean(depthTest) });
  }

  @Input() set depthWrite(depthWrite: NgtBooleanInput) {
    this.set({ depthWrite: coerceBoolean(depthWrite) });
  }

  @Input() set name(name: string) {
    this.set({ name });
  }

  @Input() set opacity(opacity: NgtObservableInput<NgtNumberInput>) {
    this.set({
      opacity: isObservable(opacity) ? opacity.pipe(map(coerceNumber)) : coerceNumber(opacity),
    });
  }

  @Input() set polygonOffset(polygonOffset: NgtBooleanInput) {
    this.set({ polygonOffset: coerceBoolean(polygonOffset) });
  }

  @Input() set polygonOffsetFactor(polygonOffsetFactor: NgtNumberInput) {
    this.set({
      polygonOffsetFactor: coerceNumber(polygonOffsetFactor),
    });
  }

  @Input() set polygonOffsetUnits(polygonOffsetUnits: NgtNumberInput) {
    this.set({
      polygonOffsetUnits: coerceNumber(polygonOffsetUnits),
    });
  }

  @Input() set precision(precision: 'highp' | 'mediump' | 'lowp' | null) {
    this.set({ precision });
  }

  @Input() set premultipliedAlpha(premultipliedAlpha: NgtBooleanInput) {
    this.set({
      premultipliedAlpha: coerceBoolean(premultipliedAlpha),
    });
  }

  @Input() set dithering(dithering: NgtBooleanInput) {
    this.set({ dithering: coerceBoolean(dithering) });
  }

  @Input() set side(side: THREE.Side) {
    this.set({ side });
  }

  @Input() set shadowSide(shadowSide: THREE.Side) {
    this.set({ shadowSide });
  }

  @Input() set toneMapped(toneMapped: NgtBooleanInput) {
    this.set({ toneMapped: coerceBoolean(toneMapped) });
  }

  @Input() set transparent(transparent: NgtBooleanInput) {
    this.set({ transparent: coerceBoolean(transparent) });
  }

  @Input() set vertexColors(vertexColors: NgtBooleanInput) {
    this.set({ vertexColors: coerceBoolean(vertexColors) });
  }

  @Input() set visible(visible: NgtBooleanInput) {
    this.set({ visible: coerceBoolean(visible) });
  }

  @Input() set format(format: THREE.PixelFormat) {
    this.set({ format });
  }

  @Input() set stencilWrite(stencilWrite: NgtBooleanInput) {
    this.set({ stencilWrite: coerceBoolean(stencilWrite) });
  }

  @Input() set stencilFunc(stencilFunc: THREE.StencilFunc) {
    this.set({ stencilFunc });
  }

  @Input() set stencilRef(stencilRef: NgtNumberInput) {
    this.set({ stencilRef: coerceNumber(stencilRef) });
  }

  @Input() set stencilWriteMask(stencilWriteMask: NgtNumberInput) {
    this.set({ stencilWriteMask: coerceNumber(stencilWriteMask) });
  }

  @Input() set stencilFuncMask(stencilFuncMask: NgtNumberInput) {
    this.set({ stencilFuncMask: coerceNumber(stencilFuncMask) });
  }

  @Input() set stencilFail(stencilFail: THREE.StencilOp) {
    this.set({ stencilFail });
  }

  @Input() set stencilZFail(stencilZFail: THREE.StencilOp) {
    this.set({ stencilZFail });
  }

  @Input() set stencilZPass(stencilZPass: THREE.StencilOp) {
    this.set({ stencilZPass });
  }

  @Input() set userData(userData: any) {
    this.set({ userData });
  }

  abstract get materialType(): NgtAnyConstructor<TMaterial>;

  override parentRef = injectObjectRef({
    optional: true,
    skipSelf: true,
  });

  override parentHostRef = injectObjectHostRef({
    optional: true,
    skipSelf: true,
  });

  override initialize() {
    super.initialize();
    this.set({ attach: ['material'] });
  }

  override initFn(prepareInstance: NgtPrepareInstanceFn<TMaterial>): (() => void) | void | undefined {
    const material = prepareInstance(new this.materialType());
    return () => {
      material.dispose();
    };
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'alphaTest',
      'alphaToCoverage',
      'blendDst',
      'blendDstAlpha',
      'blendEquation',
      'blendEquationAlpha',
      'blending',
      'blendSrc',
      'blendSrcAlpha',
      'clipIntersection',
      'clippingPlanes',
      'clipShadows',
      'colorWrite',
      'defines',
      'depthFunc',
      'depthTest',
      'depthWrite',
      'fog',
      'name',
      'opacity',
      'polygonOffset',
      'polygonOffsetFactor',
      'polygonOffsetUnits',
      'precision',
      'premultipliedAlpha',
      'dithering',
      'side',
      'shadowSide',
      'toneMapped',
      'transparent',
      'vertexColors',
      'visible',
      'format',
      'stencilWrite',
      'stencilFunc',
      'stencilRef',
      'stencilWriteMask',
      'stencilFuncMask',
      'stencilFail',
      'stencilZFail',
      'stencilZPass',
      'userData',
    ];
  }
}

export const provideNgtCommonMaterial = createNgtProvider(NgtCommonMaterial, provideNgtInstance);
