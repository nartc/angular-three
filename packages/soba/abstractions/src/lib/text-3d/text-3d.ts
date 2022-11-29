import { NgtArgs, NgtCompound, NgtObjectCompound, NgtObservableInput, provideInstanceRef } from '@angular-three/core';
import { NgtMesh } from '@angular-three/core/objects';
import { Component, Input } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { FontLoader, TextGeometry } from 'three-stdlib';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';
import { SobaTextGeometry } from './text-geometry';

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
    selector: 'ngt-soba-text-3d[font][text]',
    standalone: true,
    template: `
        <ngt-mesh [objectCompound]="this">
            <ngt-soba-text-geometry *args="geometryArgs$"></ngt-soba-text-geometry>
            <ng-content></ng-content>
        </ngt-mesh>
    `,
    imports: [NgtMesh, SobaTextGeometry, NgtArgs, NgtObjectCompound],
    providers: [provideInstanceRef(SobaText3D, { compound: true })],
    inputs: [...NGT_INSTANCE_INPUTS, ...NGT_OBJECT3D_INPUTS],
    outputs: NGT_INSTANCE_OUTPUTS,
})
export class SobaText3D extends NgtCompound<NgtMesh> {
    @Input() set bevelEnabled(bevelEnabled: NgtObservableInput<boolean>) {
        this.write({ bevelEnabled });
    }

    @Input() set bevelOffset(bevelOffset: NgtObservableInput<number>) {
        this.write({ bevelOffset });
    }

    @Input() set bevelSize(bevelSize: NgtObservableInput<number>) {
        this.write({ bevelSize });
    }

    @Input() set bevelThickness(bevelThickness: NgtObservableInput<number>) {
        this.write({ bevelThickness });
    }

    @Input() set bevelSegments(bevelSegments: NgtObservableInput<number>) {
        this.write({ bevelSegments });
    }

    @Input() set curveSegments(curveSegments: NgtObservableInput<number>) {
        this.write({ curveSegments });
    }

    @Input() set height(height: NgtObservableInput<number>) {
        this.write({ height });
    }

    @Input() set size(size: NgtObservableInput<number>) {
        this.write({ size });
    }

    @Input() set lineHeight(lineHeight: NgtObservableInput<number>) {
        this.write({ lineHeight });
    }

    @Input() set letterSpacing(letterSpacing: NgtObservableInput<number>) {
        this.write({ letterSpacing });
    }

    @Input() set font(font: FontData | string) {
        this.write({ font });
    }

    @Input() set text(text: string) {
        this.write({ text });
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
        this.write({
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
}
