import {
  Material,
  MathUtils,
  Mesh,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  WebGLRenderer,
} from 'three';
import type { NgtDpr, NgtGLOptions, NgtIntersection, NgtObjectMap, NgtSize } from '../types';

const idCache: { [id: string]: boolean | undefined } = {};
export function makeId(event?: NgtIntersection): string {
  if (event) {
    return (event.eventObject || event.object).uuid + '/' + event.index + event.instanceId;
  }

  const newId = MathUtils.generateUUID();
  // ensure not already used
  if (!idCache[newId]) {
    idCache[newId] = true;
    return newId;
  }
  return makeId();
}

export function makeDpr(dpr: NgtDpr, window?: Window) {
  const target = window?.devicePixelRatio || 1;
  return Array.isArray(dpr) ? Math.min(Math.max(dpr[0], target), dpr[1]) : dpr;
}

export function makeDefaultCamera(isOrthographic: boolean, size: NgtSize) {
  if (isOrthographic) return new OrthographicCamera(0, 0, 0, 0, 0.1, 1000);
  return new PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
}

export function makeDefaultRenderer(
  glOptions: NgtGLOptions,
  canvasElement: HTMLCanvasElement
): WebGLRenderer {
  const customRenderer = (
    typeof glOptions === 'function' ? glOptions(canvasElement) : glOptions
  ) as WebGLRenderer;

  if (customRenderer?.render != null) return customRenderer;

  return new WebGLRenderer({
    powerPreference: 'high-performance',
    canvas: canvasElement,
    antialias: true,
    alpha: true,
    ...(glOptions || {}),
  });
}

export function makeObjectGraph(object: Object3D): NgtObjectMap {
  const data: NgtObjectMap = { nodes: {}, materials: {} };

  if (object) {
    object.traverse((child: Object3D) => {
      if (child.name) data.nodes[child.name] = child;
      if ('material' in child && !data.materials[((child as Mesh).material as Material).name]) {
        data.materials[((child as Mesh).material as Material).name] = (child as Mesh)
          .material as Material;
      }
    });
  }
  return data;
}
