import type { BufferGeometry } from 'three';

export function isGeometry(obj: unknown): obj is BufferGeometry {
    return !!(obj as Record<string, unknown>)['isBufferGeometry'];
}
