import { UnknownRecord } from '@angular-three/core/typings';
import { defer, from, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Font, FontLoader } from 'three';

const fontLoader = new FontLoader();

export function loadFont(
  dataOrUrl: string | UnknownRecord,
  onLoad?: (font: Font) => void
): Observable<Font> {
  return defer(() => {
    if (typeof dataOrUrl === 'string')
      return from(fontLoader.loadAsync(dataOrUrl));
    return of(fontLoader.parse(dataOrUrl));
  }).pipe(
    tap((font) => {
      if (onLoad) {
        onLoad(font);
      }
    })
  );
}
