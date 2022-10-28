import { EventEmitter } from '@angular/core';
import * as THREE from 'three';
import { NgtRef } from '../ref';
import type { EquConfig, NgtInstanceNode, UnknownRecord } from '../types';

export const is = {
  obj: (a: unknown): a is object =>
    a === Object(a) && !is.arr(a) && typeof a !== 'function',
  material: (a: unknown): a is THREE.Material =>
    !!a && (a as THREE.Material)['isMaterial'],
  geometry: (a: unknown): a is THREE.BufferGeometry =>
    !!a && (a as THREE.BufferGeometry)['isBufferGeometry'],
  mesh: (a: unknown): a is THREE.Mesh => !!a && (a as THREE.Mesh).isMesh,
  orthographic: (a: unknown): a is THREE.OrthographicCamera =>
    !!a && (a as THREE.OrthographicCamera).isOrthographicCamera,
  perspective: (a: unknown): a is THREE.PerspectiveCamera =>
    !!a && (a as THREE.PerspectiveCamera).isPerspectiveCamera,
  camera: (a: unknown): a is THREE.Camera =>
    !!a && (a as THREE.Camera).isCamera,
  glRenderer: (a: unknown): a is THREE.WebGLRenderer =>
    !!a && a instanceof THREE.WebGLRenderer,
  scene: (a: unknown): a is THREE.Scene => !!a && (a as THREE.Scene).isScene,
  object3d: (a: unknown): a is THREE.Object3D =>
    !!a && (a as THREE.Object3D).isObject3D,
  instance: (a: unknown): a is NgtInstanceNode =>
    !!a && !!(a as UnknownRecord)['__ngt__'],
  ref: (a: unknown): a is NgtRef => !!a && a instanceof NgtRef,
  vector3: (a: unknown): a is THREE.Vector3 =>
    !!a && (a as THREE.Vector3).isVector3,
  color: (a: unknown): a is THREE.Color => !!a && (a as THREE.Color).isColor,
  supportColorManagement: (): boolean => 'ColorManagement' in THREE,
  fun: (a: unknown): a is Function => typeof a === 'function',
  str: (a: unknown): a is string => typeof a === 'string',
  num: (a: unknown): a is number => typeof a === 'number',
  boo: (a: unknown): a is boolean => typeof a === 'boolean',
  und: (a: unknown) => a === void 0,
  eventEmitter: (a: unknown): a is EventEmitter<any> =>
    a instanceof EventEmitter,
  arr: (a: unknown): a is Array<any> => Array.isArray(a),
  canvas: (a: unknown): a is HTMLCanvasElement =>
    a instanceof HTMLCanvasElement,
  equ(
    a: any,
    b: any,
    { arrays = 'shallow', objects = 'reference', strict = true }: EquConfig = {}
  ) {
    // Wrong type or one of the two undefined, doesn't match
    if (typeof a !== typeof b || !!a !== !!b) return false;
    // Atomic, just compare a against b
    if (is.str(a) || is.num(a)) return a === b;
    const isObj = is.obj(a);
    if (isObj && objects === 'reference') return a === b;
    const isArr = is.arr(a);
    if (isArr && arrays === 'reference') return a === b;
    // Array or Object, shallow compare first to see if it's a match
    if ((isArr || isObj) && a === b) return true;
    // Last resort, go through keys
    let i;
    for (i in a) if (!(i in b)) return false;
    for (i in strict ? b : a) if (a[i] !== b[i]) return false;
    if (is.und(i)) {
      if (isArr && a.length === 0 && b.length === 0) return true;
      if (isObj && Object.keys(a).length === 0 && Object.keys(b).length === 0)
        return true;
      if (a !== b) return false;
    }
    return true;
  },
};
