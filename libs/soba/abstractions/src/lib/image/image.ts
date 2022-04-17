import {
    AnyFunction,
    NGT_INSTANCE_HOST_REF,
    NGT_INSTANCE_REF,
    NgtObjectInputs,
    NgtObjectInputsState,
    NgtRef,
    NgtRenderState,
    NgtStore,
    provideObjectHosRef,
    startWithUndefined,
} from '@angular-three/core';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtTextureLoader } from '@angular-three/soba/loaders';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Directive,
    EventEmitter,
    Inject,
    Input,
    NgModule,
    NgZone,
    Optional,
    Output,
    SkipSelf,
    TemplateRef,
} from '@angular/core';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaImageShaderMaterialModule } from './image-shader-material';

@Directive({
    selector: 'ng-template[ngt-soba-image-content]',
})
export class NgtSobaImageContent {
    constructor(
        public templateRef: TemplateRef<{ image: NgtRef<THREE.Mesh> }>
    ) {}

    static ngTemplateContextGuard(
        dir: NgtSobaImageContent,
        ctx: any
    ): ctx is { image: NgtRef<THREE.Mesh> } {
        return true;
    }
}

export interface NgtSobaImageState extends NgtObjectInputsState<THREE.Mesh> {
    url: string;
    segments?: number;
    zoom?: number;
    grayscale?: number;
    toneMapped?: boolean;
    texture: THREE.Texture;
}

@Component({
    selector: 'ngt-soba-image[url]',
    template: `
        <ng-container *ngIf="imageViewModel$ | async as imageViewModel">
            <ngt-plane-geometry
                noAttach
                #ngtPlane
                [args]="[
                    1,
                    1,
                    imageViewModel.segments,
                    imageViewModel.segments
                ]"
            ></ngt-plane-geometry>

            <ngt-soba-image-shader-material
                #ngtMaterial
                [color]="color!"
                [map]="imageViewModel.texture"
                [zoom]="imageViewModel.zoom!"
                [grayscale]="imageViewModel.grayscale!"
                [scale]="imageViewModel.planeBounds"
                [imageBounds]="imageViewModel.imageBounds"
                [toneMapped]="imageViewModel.toneMapped!"
            ></ngt-soba-image-shader-material>

            <ngt-mesh
                (ready)="ready.emit($event)"
                (beforeRender)="beforeRender.emit($event)"
                [material]="ngtMaterial.instance"
                [geometry]="ngtPlane.instance"
                [ref]="instance"
                [attach]="attach"
                [skipParent]="skipParent"
                [noAttach]="noAttach"
                [name]="name"
                [position]="position"
                [rotation]="rotation"
                [quaternion]="quaternion"
                [scale]="scale"
                [color]="color!"
                [userData]="userData"
                [castShadow]="castShadow"
                [receiveShadow]="receiveShadow"
                [visible]="visible"
                [matrixAutoUpdate]="matrixAutoUpdate"
                [dispose]="dispose"
                [raycast]="raycast"
                [appendMode]="appendMode"
                [appendTo]="appendTo"
                (click)="click.emit($event)"
                (contextmenu)="contextmenu.emit($event)"
                (dblclick)="dblclick.emit($event)"
                (pointerup)="pointerup.emit($event)"
                (pointerdown)="pointerdown.emit($event)"
                (pointerover)="pointerover.emit($event)"
                (pointerout)="pointerout.emit($event)"
                (pointerenter)="pointerenter.emit($event)"
                (pointerleave)="pointerleave.emit($event)"
                (pointermove)="pointermove.emit($event)"
                (pointermissed)="pointermissed.emit($event)"
                (pointercancel)="pointercancel.emit($event)"
                (wheel)="wheel.emit($event)"
            >
                <ng-container
                    *ngIf="content"
                    [ngTemplateOutlet]="content.templateRef"
                    [ngTemplateOutletContext]="{ image: instance }"
                ></ng-container>
            </ngt-mesh>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NgtTextureLoader,
        provideObjectHosRef(
            NgtSobaImage,
            (image) => image.instance,
            (image) => image.parentRef
        ),
    ],
})
export class NgtSobaImage extends NgtObjectInputs<
    THREE.Mesh,
    NgtSobaImageState
> {
    @Output() beforeRender = new EventEmitter<{
        state: NgtRenderState;
        object: THREE.Mesh;
    }>();

    @Input() set url(url: string) {
        this.set({ url });
    }

    @Input() set segments(segments: number) {
        this.set({ segments });
    }

    @Input() set zoom(zoom: number) {
        this.set({ zoom });
    }

    @Input() set grayscale(grayscale: number) {
        this.set({ grayscale });
    }

    @Input() set toneMapped(toneMapped: boolean) {
        this.set({ toneMapped });
    }

    @ContentChild(NgtSobaImageContent) content?: NgtSobaImageContent;

    texture$!: Observable<THREE.Texture>;
    imageBounds!: [number, number];
    planeBounds: [number, number] = [1, 1];

    constructor(
        zone: NgZone,
        store: NgtStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_REF)
        parentRef: AnyFunction<NgtRef>,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_HOST_REF)
        parentHostRef: AnyFunction<NgtRef>,
        private textureLoader: NgtTextureLoader
    ) {
        super(zone, store, parentRef, parentHostRef);
        this.set({
            segments: 1,
            zoom: 1,
            grayscale: 0,
        });
    }

    readonly imageViewModel$ = this.select(
        this.select((s) => s.texture),
        this.select((s) => s.zoom),
        this.select((s) => s.color),
        this.select((s) => s.segments),
        this.select((s) => s.scale),
        this.select((s) => s.grayscale),
        this.select((s) => s.toneMapped).pipe(startWithUndefined()),
        (texture, zoom, color, segments, scale, grayscale, toneMapped) => ({
            texture,
            zoom,
            color,
            segments,
            grayscale,
            toneMapped,
            planeBounds: [scale.x, scale.y],
            imageBounds: [texture.image.width, texture.image.height],
        })
    );

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.setTexture(this.select((s) => s.url));
            });
        });
        super.ngOnInit();
    }

    private readonly setTexture = this.effect<string>(
        switchMap((url) =>
            this.textureLoader.load(url).pipe(
                tap((texture) => {
                    this.set({ texture });
                }),
                catchError(() => EMPTY)
            )
        )
    );
}

@NgModule({
    declarations: [NgtSobaImage, NgtSobaImageContent],
    exports: [NgtSobaImage, NgtSobaImageContent],
    imports: [
        NgtMeshModule,
        NgtPlaneGeometryModule,
        NgtSobaImageShaderMaterialModule,
        CommonModule,
    ],
})
export class NgtSobaImageModule {}
