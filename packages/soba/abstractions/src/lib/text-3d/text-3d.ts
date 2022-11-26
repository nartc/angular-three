import {
    injectInstance,
    NgtArgs,
    NgtInstance,
    NgtObservableInput,
    NgtWrapper,
    provideInstanceRef,
} from '@angular-three/core';
import { NgtMesh } from '@angular-three/core/objects';
import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { FontLoader, TextGeometry } from 'three-stdlib';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS } from '../common';
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
        <ngt-mesh *wrapper="this">
            <ngt-soba-text-geometry *args="geometryArgs$"></ngt-soba-text-geometry>
            <ng-content></ng-content>
        </ngt-mesh>
    `,
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(SobaText3D)],
    imports: [NgtMesh, NgtWrapper, SobaTextGeometry, NgtArgs, AsyncPipe],
})
export class SobaText3D extends NgtMesh {
    private readonly instance = injectInstance<THREE.Mesh>({ host: true });

    constructor() {
        super();
        this.instance.write({
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

    @Input() set bevelEnabled(bevelEnabled: NgtObservableInput<boolean>) {
        this.instance.write({ bevelEnabled });
    }

    @Input() set bevelOffset(bevelOffset: NgtObservableInput<number>) {
        this.instance.write({ bevelOffset });
    }

    @Input() set bevelSize(bevelSize: NgtObservableInput<number>) {
        this.instance.write({ bevelSize });
    }

    @Input() set bevelThickness(bevelThickness: NgtObservableInput<number>) {
        this.instance.write({ bevelThickness });
    }

    @Input() set bevelSegments(bevelSegments: NgtObservableInput<number>) {
        this.instance.write({ bevelSegments });
    }

    @Input() set curveSegments(curveSegments: NgtObservableInput<number>) {
        this.instance.write({ curveSegments });
    }

    @Input() set height(height: NgtObservableInput<number>) {
        this.instance.write({ height });
    }

    @Input() set size(size: NgtObservableInput<number>) {
        this.instance.write({ size });
    }

    @Input() set lineHeight(lineHeight: NgtObservableInput<number>) {
        this.instance.write({ lineHeight });
    }

    @Input() set letterSpacing(letterSpacing: NgtObservableInput<number>) {
        this.instance.write({ letterSpacing });
    }

    @Input() set font(font: FontData | string) {
        this.instance.write({ font });
    }

    @Input() set text(text: string) {
        this.instance.write({ text });
    }

    readonly font$ = this.instance
        .select((s) => s['font'])
        .pipe(
            switchMap((font) => {
                if (typeof font === 'string') {
                    return fetch(font).then((response) => response.json()) as Promise<FontData>;
                }

                return of(font as FontData);
            }),
            map((fontData) => new FontLoader().parse(fontData))
        );

    readonly geometryArgs$: Observable<ConstructorParameters<typeof TextGeometry>> = this.instance.select(
        this.font$,
        this.instance.select((s) => s['text']),
        this.instance.select((s) => s['size']),
        this.instance.select((s) => s['height']),
        this.instance.select((s) => s['bevelThickness']),
        this.instance.select((s) => s['bevelSize']),
        this.instance.select((s) => s['bevelEnabled']),
        this.instance.select((s) => s['bevelSegments']),
        this.instance.select((s) => s['bevelOffset']),
        this.instance.select((s) => s['curveSegments']),
        this.instance.select((s) => s['letterSpacing']),
        this.instance.select((s) => s['lineHeight']),
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
}
