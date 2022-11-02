import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { Plane } from 'three/src/math/Plane';
import {
  NgtInstance,
  NgtInstanceState,
  provideNgtInstance,
} from '../abstracts/instance';
import { injectObjectHostRef, injectObjectRef } from '../di/object';
import type {
  AnyConstructor,
  BooleanInput,
  NgtInstanceNode,
  NumberInput,
} from '../types';
import { coerceBooleanProperty, coerceNumberProperty } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';

export interface NgtCommonMaterialState<
  TMaterial extends THREE.Material = THREE.Material
> extends NgtInstanceState<TMaterial> {
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
export abstract class NgtCommonMaterial<
  TMaterial extends THREE.Material = THREE.Material
> extends NgtInstance<TMaterial, NgtCommonMaterialState<TMaterial>> {
  @Input() set alphaTest(alphaTest: NumberInput) {
    this.set({ alphaTest: coerceNumberProperty(alphaTest) });
  }

  @Input() set alphaToCoverage(alphaToCoverage: BooleanInput) {
    this.set({ alphaToCoverage: coerceBooleanProperty(alphaToCoverage) });
  }

  @Input() set blendDst(blendDst: THREE.BlendingDstFactor) {
    this.set({ blendDst });
  }

  @Input() set blendDstAlpha(blendDstAlpha: NumberInput) {
    this.set({ blendDstAlpha: coerceNumberProperty(blendDstAlpha) });
  }

  @Input() set blendEquation(blendEquation: THREE.BlendingEquation) {
    this.set({ blendEquation });
  }

  @Input() set blendEquationAlpha(blendEquationAlpha: NumberInput) {
    this.set({
      blendEquationAlpha: coerceNumberProperty(blendEquationAlpha),
    });
  }

  @Input() set blending(blending: THREE.Blending) {
    this.set({ blending });
  }

  @Input() set blendSrc(
    blendSrc: THREE.BlendingSrcFactor | THREE.BlendingDstFactor
  ) {
    this.set({ blendSrc });
  }

  @Input() set blendSrcAlpha(blendSrcAlpha: NumberInput) {
    this.set({ blendSrcAlpha: coerceNumberProperty(blendSrcAlpha) });
  }

  @Input() set clipIntersection(clipIntersection: BooleanInput) {
    this.set({ clipIntersection: coerceBooleanProperty(clipIntersection) });
  }

  @Input() set clippingPlanes(clippingPlanes: Plane[]) {
    this.set({ clippingPlanes });
  }

  @Input() set clipShadows(clipShadows: BooleanInput) {
    this.set({ clipShadows: coerceBooleanProperty(clipShadows) });
  }

  @Input() set colorWrite(colorWrite: BooleanInput) {
    this.set({ colorWrite: coerceBooleanProperty(colorWrite) });
  }

  @Input() set defines(defines: any) {
    this.set({ defines });
  }

  @Input() set depthFunc(depthFunc: THREE.DepthModes) {
    this.set({ depthFunc });
  }

  @Input() set depthTest(depthTest: BooleanInput) {
    this.set({ depthTest: coerceBooleanProperty(depthTest) });
  }

  @Input() set depthWrite(depthWrite: BooleanInput) {
    this.set({ depthWrite: coerceBooleanProperty(depthWrite) });
  }

  @Input() set name(name: string) {
    this.set({ name });
  }

  @Input() set opacity(opacity: NumberInput) {
    this.set({ opacity: coerceNumberProperty(opacity) });
  }

  @Input() set polygonOffset(polygonOffset: BooleanInput) {
    this.set({ polygonOffset: coerceBooleanProperty(polygonOffset) });
  }

  @Input() set polygonOffsetFactor(polygonOffsetFactor: NumberInput) {
    this.set({
      polygonOffsetFactor: coerceNumberProperty(polygonOffsetFactor),
    });
  }

  @Input() set polygonOffsetUnits(polygonOffsetUnits: NumberInput) {
    this.set({
      polygonOffsetUnits: coerceNumberProperty(polygonOffsetUnits),
    });
  }

  @Input() set precision(precision: 'highp' | 'mediump' | 'lowp' | null) {
    this.set({ precision });
  }

  @Input() set premultipliedAlpha(premultipliedAlpha: BooleanInput) {
    this.set({
      premultipliedAlpha: coerceBooleanProperty(premultipliedAlpha),
    });
  }

  @Input() set dithering(dithering: BooleanInput) {
    this.set({ dithering: coerceBooleanProperty(dithering) });
  }

  @Input() set side(side: THREE.Side) {
    this.set({ side });
  }

  @Input() set shadowSide(shadowSide: THREE.Side) {
    this.set({ shadowSide });
  }

  @Input() set toneMapped(toneMapped: BooleanInput) {
    this.set({ toneMapped: coerceBooleanProperty(toneMapped) });
  }

  @Input() set transparent(transparent: BooleanInput) {
    this.set({ transparent: coerceBooleanProperty(transparent) });
  }

  @Input() set vertexColors(vertexColors: BooleanInput) {
    this.set({ vertexColors: coerceBooleanProperty(vertexColors) });
  }

  @Input() set visible(visible: BooleanInput) {
    this.set({ visible: coerceBooleanProperty(visible) });
  }

  @Input() set format(format: THREE.PixelFormat) {
    this.set({ format });
  }

  @Input() set stencilWrite(stencilWrite: BooleanInput) {
    this.set({ stencilWrite: coerceBooleanProperty(stencilWrite) });
  }

  @Input() set stencilFunc(stencilFunc: THREE.StencilFunc) {
    this.set({ stencilFunc });
  }

  @Input() set stencilRef(stencilRef: NumberInput) {
    this.set({ stencilRef: coerceNumberProperty(stencilRef) });
  }

  @Input() set stencilWriteMask(stencilWriteMask: NumberInput) {
    this.set({ stencilWriteMask: coerceNumberProperty(stencilWriteMask) });
  }

  @Input() set stencilFuncMask(stencilFuncMask: NumberInput) {
    this.set({ stencilFuncMask: coerceNumberProperty(stencilFuncMask) });
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

  abstract get materialType(): AnyConstructor<TMaterial>;

  protected override parentRef = injectObjectRef({
    optional: true,
    skipSelf: true,
  });

  protected override parentHostRef = injectObjectHostRef({
    optional: true,
    skipSelf: true,
  });

  protected override preInit() {
    this.set((s) => ({
      attach: s.attach.length ? s.attach : ['material'],
    }));
  }

  protected override initFn(
    prepareInstance: (
      instance: TMaterial,
      uuid?: string
    ) => NgtInstanceNode<TMaterial>
  ): (() => void) | void | undefined {
    const material = prepareInstance(new this.materialType());
    return () => {
      material.dispose();
    };
  }

  protected override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      alphaTest: true,
      alphaToCoverage: true,
      blendDst: true,
      blendDstAlpha: true,
      blendEquation: true,
      blendEquationAlpha: true,
      blending: true,
      blendSrc: true,
      blendSrcAlpha: true,
      clipIntersection: true,
      clippingPlanes: true,
      clipShadows: true,
      colorWrite: true,
      defines: true,
      depthFunc: true,
      depthTest: true,
      depthWrite: true,
      fog: true,
      name: true,
      opacity: true,
      polygonOffset: true,
      polygonOffsetFactor: true,
      polygonOffsetUnits: true,
      precision: true,
      premultipliedAlpha: true,
      dithering: true,
      side: true,
      shadowSide: true,
      toneMapped: true,
      transparent: true,
      vertexColors: true,
      visible: true,
      format: true,
      stencilWrite: true,
      stencilFunc: true,
      stencilRef: true,
      stencilWriteMask: true,
      stencilFuncMask: true,
      stencilFail: true,
      stencilZFail: true,
      stencilZPass: true,
      userData: true,
    };
  }
}

export const provideNgtCommonMaterial = createNgtProvider(
  NgtCommonMaterial,
  provideNgtInstance
);
