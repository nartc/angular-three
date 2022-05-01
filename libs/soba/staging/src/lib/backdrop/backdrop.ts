import {
    coerceNumberProperty,
    NgtObjectInputs,
    NgtObjectInputsState,
    NgtObjectPassThroughModule,
    NgtRadianPipeModule,
    NumberInput,
    provideObjectHostRef,
    Ref,
} from '@angular-three/core';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Directive,
    Input,
    NgModule,
    TemplateRef,
} from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';

const easeInExpo = (x: number) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10));

export interface NgtSobaBackdropState
    extends NgtObjectInputsState<THREE.Group> {
    backdrop: Ref<THREE.Mesh>;
    floor: number;
    segments: number;
}

@Directive({
    selector: 'ng-template[ngt-soba-backdrop-content]',
})
export class NgtSobaBackdropContent {
    constructor(
        public templateRef: TemplateRef<{ backdrop: Ref<THREE.Mesh> }>
    ) {}

    static ngTemplateContextGuard(
        dir: NgtSobaBackdropContent,
        ctx: any
    ): ctx is { backdrop: Ref<THREE.Mesh> } {
        return true;
    }
}

@Component({
    selector: 'ngt-soba-backdrop',
    template: `
        <ngt-group
            [ngtObjectOutputs]="this"
            [ngtObjectInputs]="this"
            receiveShadow="false"
            skipParent
        >
            <ngt-mesh
                [ref]="backdropMesh"
                [receiveShadow]="receiveShadow"
                [rotation]="[-90 | radian, 0, 90 | radian]"
            >
                <ngt-plane-geometry
                    (ready)="set({ planeGeometry: $event })"
                    [args]="[1, 1, $any(segments), $any(segments)]"
                ></ngt-plane-geometry>
                <ng-container
                    *ngIf="content"
                    [ngTemplateOutlet]="content.templateRef"
                    [ngTemplateOutletContext]="{ backdrop: backdropMesh }"
                ></ng-container>
            </ngt-mesh>
        </ngt-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideObjectHostRef(
            NgtSobaBackdrop,
            (backdrop) => backdrop.backdropMesh
        ),
    ],
})
export class NgtSobaBackdrop extends NgtObjectInputs<
    THREE.Group,
    NgtSobaBackdropState
> {
    @Input() set floor(floor: NumberInput) {
        this.set({ floor: coerceNumberProperty(floor) });
    }

    @Input() set segments(segments: NumberInput) {
        this.set({ segments: coerceNumberProperty(segments) });
    }
    get segments() {
        return this.get((s) => s.segments);
    }

    @ContentChild(NgtSobaBackdropContent) content?: NgtSobaBackdropContent;

    get backdropMesh() {
        return this.get((s) => s.backdrop);
    }

    protected override preInit() {
        super.preInit();
        this.set((state) => ({
            backdrop: new Ref(),
            floor: state.floor ?? 0.25,
            segments: state.segments ?? 20,
        }));
    }

    override ngOnInit() {
        super.ngOnInit();
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.setup(
                    this.select(
                        this.select((s) => s.segments),
                        this.select((s) => s.floor),
                        this.select((s) => s['planeGeometry'])
                    )
                );
            });
        });
    }

    private readonly setup = this.effect<{}>(
        tap(() => {
            const { segments, floor, planeGeometry } = this.get();
            let i = 0;
            const offset = segments / segments / 2;
            const position = planeGeometry.attributes.position;
            for (let x = 0; x < segments + 1; x++) {
                for (let y = 0; y < segments + 1; y++) {
                    position.setXYZ(
                        i++,
                        x / segments - offset + (x === 0 ? -floor : 0),
                        y / segments - offset,
                        easeInExpo(x / segments)
                    );
                }
            }
            position.needsUpdate = true;
            planeGeometry.computeVertexNormals();
        })
    );
}

@NgModule({
    declarations: [NgtSobaBackdrop, NgtSobaBackdropContent],
    exports: [NgtSobaBackdrop, NgtSobaBackdropContent],
    imports: [
        NgtGroupModule,
        NgtObjectPassThroughModule,
        NgtMeshModule,
        NgtRadianPipeModule,
        NgtPlaneGeometryModule,
        CommonModule,
    ],
})
export class NgtSobaBackdropModule {}
