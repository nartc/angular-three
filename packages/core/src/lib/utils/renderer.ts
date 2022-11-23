import * as THREE from 'three';
import type { NgtGLOptions } from '../types';

export function createRenderer(glOptions: NgtGLOptions, canvasElement: HTMLCanvasElement): THREE.WebGLRenderer {
    const customRenderer = (
        typeof glOptions === 'function' ? glOptions(canvasElement) : glOptions
    ) as THREE.WebGLRenderer;

    if (customRenderer?.render != null) {
        return customRenderer;
    }

    return new THREE.WebGLRenderer({
        powerPreference: 'high-performance',
        canvas: canvasElement,
        antialias: true,
        alpha: true,
        ...(glOptions || {}),
    });
}
