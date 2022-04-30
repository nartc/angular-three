import {
    AnyConstructor,
    is,
    NgtCommonGeometry,
    NgtTriple,
    provideCommonGeometryRef,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { LineGeometry } from 'three-stdlib';

@Component({
    selector: 'ngt-soba-line-geometry',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonGeometryRef(NgtSobaLineGeometry)],
})
export class NgtSobaLineGeometry extends NgtCommonGeometry<LineGeometry> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof LineGeometry>
        | undefined;

    @Input() set points(points: Array<THREE.Vector3 | NgtTriple>) {
        this.set({ points });
    }

    @Input() set vertexColors(vertexColors: Array<THREE.Color | NgtTriple>) {
        this.set({ vertexColors });
    }

    override get geometryType(): AnyConstructor<LineGeometry> {
        return LineGeometry;
    }

    protected override get ctorParams$(): Observable<{}> {
        return this.select(
            this.select((s) => s['points']),
            this.select((s) => s['vertexColors'])
        );
    }

    protected override postInit() {
        const { instance: geometry, points, vertexColors } = this.get();

        const pointValues = (points as Array<THREE.Vector3 | NgtTriple>).map(
            (p) => (is.vector3(p) ? p.toArray() : p)
        );

        geometry.value.setPositions(pointValues.flat());

        if (vertexColors.length) {
            const colorValues = (
                vertexColors as Array<THREE.Color | NgtTriple>
            ).map((c) => (is.color(c) ? c.toArray() : c));
            geometry.value.setColors(colorValues.flat());
        }
    }
}

@NgModule({
    declarations: [NgtSobaLineGeometry],
    exports: [NgtSobaLineGeometry],
})
export class NgtSobaLineGeometryModule {}
