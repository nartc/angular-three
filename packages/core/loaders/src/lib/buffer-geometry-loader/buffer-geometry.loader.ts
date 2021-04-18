import type { UnknownRecord } from '@angular-three/core/typings';
import { defer, from, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { BufferGeometry, InstancedBufferGeometry } from 'three';
import { BufferGeometryLoader } from 'three';

const bufferGeometryLoader = new BufferGeometryLoader();

export function loadBufferGeometry(
  data: string | UnknownRecord,
  onLoad?: (geometry: InstancedBufferGeometry | BufferGeometry) => void
): Observable<InstancedBufferGeometry | BufferGeometry> {
  return defer(() => {
    if (typeof data === 'string')
      return from(bufferGeometryLoader.loadAsync(data));
    return of(bufferGeometryLoader.parse(data));
  }).pipe(
    tap((geometry) => {
      if (onLoad) onLoad(geometry);
    })
  );
}
