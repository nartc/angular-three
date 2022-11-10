import {
  coerceBoolean,
  coerceNumber,
  NgtBooleanInput,
  NgtNumberInput,
  NgtObjectPassThrough,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
} from '@angular-three/core';
import { NgtMesh } from '@angular-three/core/objects';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { FontLoader, TextGeometry } from 'three-stdlib';
import { NgtSobaTextGeometry } from './text-geometry';

interface Glyph {
  _cachedOutline: string[];
  ha: number;
  o: string;
}

interface FontData {
  boundingBox: {
    yMax: number;
    yMin: number;
  };
  familyName: string;
  glyphs: {
    [k: string]: Glyph;
  };
  resolution: number;
  underlineThickness: number;
}

@Component({
  selector: 'ngt-soba-text-3d[font]',
  standalone: true,
  template: `
    <ngt-mesh shouldPassThroughRef [ngtObjectPassThrough]="this">
      <ngt-soba-text-geometry
        *ngIf="geometryArgs$ | async as geometryArgs"
        [args]="geometryArgs"
      ></ngt-soba-text-geometry>
      <ng-content></ng-content>
    </ngt-mesh>
  `,

  imports: [NgtMesh, NgtObjectPassThrough, NgtSobaTextGeometry, NgIf, AsyncPipe],
  providers: [provideNgtObject(NgtSobaText3D), provideObjectRef(NgtSobaText3D), provideObjectHostRef(NgtSobaText3D)],
})
export class NgtSobaText3D extends NgtMesh {
  override isWrapper = true;

  @Input() set bevelEnabled(bevelEnabled: NgtBooleanInput) {
    this.set({ bevelEnabled: coerceBoolean(bevelEnabled) });
  }

  @Input() set bevelOffset(bevelOffset: NgtNumberInput) {
    this.set({ bevelOffset: coerceNumber(bevelOffset) });
  }

  @Input() set bevelSize(bevelSize: NgtNumberInput) {
    this.set({ bevelSize: coerceNumber(bevelSize) });
  }

  @Input() set bevelThickness(bevelThickness: NgtNumberInput) {
    this.set({ bevelThickness: coerceNumber(bevelThickness) });
  }

  @Input() set bevelSegments(bevelSegments: NgtNumberInput) {
    this.set({ bevelSegments: coerceNumber(bevelSegments) });
  }

  @Input() set curveSegments(curveSegments: NgtNumberInput) {
    this.set({ curveSegments: coerceNumber(curveSegments) });
  }

  @Input() set height(height: NgtNumberInput) {
    this.set({ height: coerceNumber(height) });
  }

  @Input() set size(size: NgtNumberInput) {
    this.set({ size: coerceNumber(size) });
  }

  @Input() set lineHeight(lineHeight: NgtNumberInput) {
    this.set({ lineHeight: coerceNumber(lineHeight) });
  }

  @Input() set letterSpacing(letterSpacing: NgtNumberInput) {
    this.set({ letterSpacing: coerceNumber(letterSpacing) });
  }

  @Input() set font(font: FontData | string) {
    this.set({ font });
  }

  @Input() set text(text: string) {
    this.set({ text });
  }

  readonly font$ = this.select((s) => s['font']).pipe(
    switchMap((font) => {
      if (typeof font === 'string') {
        return fetch(font).then((response) => response.json()) as Promise<FontData>;
      }

      return of(font as FontData);
    }),
    map((fontData) => new FontLoader().parse(fontData))
  );

  readonly geometryArgs$: Observable<ConstructorParameters<typeof TextGeometry>> = this.select(
    this.font$,
    this.select((s) => s['text']),
    this.select((s) => s['size']),
    this.select((s) => s['height']),
    this.select((s) => s['bevelThickness']),
    this.select((s) => s['bevelSize']),
    this.select((s) => s['bevelEnabled']),
    this.select((s) => s['bevelSegments']),
    this.select((s) => s['bevelOffset']),
    this.select((s) => s['curveSegments']),
    this.select((s) => s['letterSpacing']),
    this.select((s) => s['lineHeight']),
    (
      font,
      text,
      size,
      height,
      bevelThickness,
      bevelSize,
      bevelEnabled,
      bevelSegments,
      bevelOffset,
      curveSegments,
      letterSpacing,
      lineHeight
    ) => [
      text,
      {
        font,
        size,
        height,
        bevelThickness,
        bevelSize,
        bevelEnabled,
        bevelSegments,
        bevelOffset,
        curveSegments,
        letterSpacing,
        lineHeight,
      },
    ],
    { debounce: true }
  );

  override initialize() {
    super.initialize();
    this.set({
      letterSpacing: 0,
      lineHeight: 1,
      size: 1,
      height: 0.2,
      bevelThickness: 0.1,
      bevelSize: 0.01,
      bevelEnabled: false,
      bevelOffset: 0,
      bevelSegments: 4,
      curveSegments: 8,
      text: '',
    });
  }
}
