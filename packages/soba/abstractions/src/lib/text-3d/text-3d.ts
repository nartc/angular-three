import { extend, NgtArgs, NgtPush, NgtRxStore } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { Mesh } from 'three';
import { FontLoader, TextGeometry } from 'three-stdlib';

declare type Glyph = {
  _cachedOutline: string[];
  ha: number;
  o: string;
};

declare type FontData = {
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
};

extend({ Mesh, TextGeometry });

@Component({
  selector: 'ngts-text-3d[font]',
  standalone: true,
  template: `
    <ngt-mesh ngtCompound>
      <ngt-text-geometry *args="geometryArgs$ | ngtPush : null"></ngt-text-geometry>
      <ng-content></ng-content>
    </ngt-mesh>
  `,
  imports: [NgtArgs, NgtPush],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsText3D extends NgtRxStore {
  @Input() set font(font: FontData | string) {
    this.set({ font });
  }

  @Input() set text(text: string) {
    this.set({ text });
  }

  @Input() set bevelEnabled(bevelEnabled: boolean) {
    this.set({ bevelEnabled });
  }

  @Input() set bevelOffset(bevelOffset: number) {
    this.set({ bevelOffset });
  }

  @Input() set bevelSize(bevelSize: number) {
    this.set({ bevelSize });
  }

  @Input() set bevelThickness(bevelThickness: number) {
    this.set({ bevelThickness });
  }

  @Input() set curveSegments(curveSegments: number) {
    this.set({ curveSegments });
  }

  @Input() set bevelSegments(bevelSegments: number) {
    this.set({ bevelSegments });
  }

  @Input() set height(height: number) {
    this.set({ height });
  }

  @Input() set size(size: number) {
    this.set({ size });
  }

  @Input() set lineHeight(lineHeight: number) {
    this.set({ lineHeight });
  }

  @Input() set letterSpacing(letterSpacing: number) {
    this.set({ letterSpacing });
  }

  override initialize(): void {
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
    });
  }

  readonly #font$ = this.select('font').pipe(
    switchMap((font) => {
      if (typeof font === 'string')
        return fetch(font).then((res) => res.json()) as Promise<FontData>;
      return of(font as FontData);
    }),
    map((fontData) => new FontLoader().parse(fontData))
  );

  readonly geometryArgs$ = combineLatest([
    this.#font$,
    this.select(
      selectSlice([
        'text',
        'size',
        'height',
        'bevelThickness',
        'bevelSize',
        'bevelEnabled',
        'bevelSegments',
        'bevelOffset',
        'curveSegments',
        'letterSpacing',
        'lineHeight',
      ])
    ),
  ]).pipe(
    map(
      ([
        font,
        {
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
          lineHeight,
        },
      ]) => [
        text,
        {
          font,
          size,
          height,
          bevelThickness,
          bevelSize,
          bevelSegments,
          bevelEnabled,
          bevelOffset,
          curveSegments,
          letterSpacing,
          lineHeight,
        },
      ]
    )
  );
}
