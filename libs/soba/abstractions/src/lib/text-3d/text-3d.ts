import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NgtObjectPassThrough,
  NumberInput,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
} from '@angular-three/core';
import { NgtMesh } from '@angular-three/core/objects';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
    <ngt-mesh [ngtObjectPassThrough]="this">
      <ngt-soba-text-geometry
        *ngIf="geometryArgs$ | async as geometryArgs"
        [args]="geometryArgs"
      ></ngt-soba-text-geometry>
      <ng-content></ng-content>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtMesh,
    NgtObjectPassThrough,
    NgtSobaTextGeometry,
    NgIf,
    AsyncPipe,
  ],
  providers: [
    provideNgtObject(NgtSobaText3D),
    provideObjectRef(NgtSobaText3D),
    provideObjectHostRef(NgtSobaText3D),
  ],
})
export class NgtSobaText3D extends NgtMesh {
  override isWrapper = true;
  override shouldPassThroughRef = true;

  @Input() set bevelEnabled(bevelEnabled: BooleanInput) {
    this.set({ bevelEnabled: coerceBooleanProperty(bevelEnabled) });
  }

  @Input() set bevelOffset(bevelOffset: NumberInput) {
    this.set({ bevelOffset: coerceNumberProperty(bevelOffset) });
  }

  @Input() set bevelSize(bevelSize: NumberInput) {
    this.set({ bevelSize: coerceNumberProperty(bevelSize) });
  }

  @Input() set bevelThickness(bevelThickness: NumberInput) {
    this.set({ bevelThickness: coerceNumberProperty(bevelThickness) });
  }

  @Input() set bevelSegments(bevelSegments: NumberInput) {
    this.set({ bevelSegments: coerceNumberProperty(bevelSegments) });
  }

  @Input() set curveSegments(curveSegments: NumberInput) {
    this.set({ curveSegments: coerceNumberProperty(curveSegments) });
  }

  @Input() set height(height: NumberInput) {
    this.set({ height: coerceNumberProperty(height) });
  }

  @Input() set size(size: NumberInput) {
    this.set({ size: coerceNumberProperty(size) });
  }

  @Input() set lineHeight(lineHeight: NumberInput) {
    this.set({ lineHeight: coerceNumberProperty(lineHeight) });
  }

  @Input() set letterSpacing(letterSpacing: NumberInput) {
    this.set({ letterSpacing: coerceNumberProperty(letterSpacing) });
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
        return fetch(font).then((response) =>
          response.json()
        ) as Promise<FontData>;
      }

      return of(font as FontData);
    }),
    map((fontData) => new FontLoader().parse(fontData))
  );

  readonly geometryArgs$: Observable<
    ConstructorParameters<typeof TextGeometry>
  > = this.select(
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

  override preInit() {
    super.preInit();
    this.set((s) => ({
      letterSpacing: s['letterSpacing'] ?? 0,
      lineHeight: s['lineHeight'] ?? 1,
      size: s['size'] ?? 1,
      height: s['height'] ?? 0.2,
      bevelThickness: s['bevelThickness'] ?? 0.1,
      bevelSize: s['bevelSize'] ?? 0.01,
      bevelEnabled: s['bevelEnabled'] ?? false,
      bevelOffset: s['bevelOffset'] ?? 0,
      bevelSegments: s['bevelSegments'] ?? 4,
      curveSegments: s['curveSegments'] ?? 8,
      text: s['text'] ?? '',
    }));
  }
}
