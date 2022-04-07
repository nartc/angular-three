import type { Material } from 'three';

export function isMaterial(obj: unknown): obj is Material {
    return !!(obj as Record<string, unknown>)['isMaterial'];
}
