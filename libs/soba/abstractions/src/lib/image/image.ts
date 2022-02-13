import {
    AnyFunction,
    createExtenderProvider,
    createHostParentObjectProvider,
    createParentObjectProvider,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
    NGT_PARENT_OBJECT,
    NgtColor,
    NgtExtender,
    NgtObjectInputsController,
    NgtObjectInputsControllerModule,
} from '@angular-three/core';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtTextureLoader } from '@angular-three/soba/loaders';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    NgModule,
    OnChanges,
    Optional,
    SkipSelf,
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaImageShaderMaterialModule } from './image-shader-material';

@Component({
    selector: 'ngt-soba-image[url]',
    template: `
        <ngt-plane-geometry
            #ngtGeometry="ngtPlaneGeometry"
            [args]="[1, 1, segments, segments]"
        ></ngt-plane-geometry>
        <ngt-soba-image-shader-material
            #ngtMaterial="ngtSobaImageShaderMaterial"
            [parameters]="{color, map: (texture$ | async)!, zoom, grayscale, scale: planeBounds, imageBounds}"
        ></ngt-soba-image-shader-material>

        <ngt-mesh
            [geometry]="ngtGeometry.geometry"
            [material]="ngtMaterial.material"
            [scale]="scale"
            [name]="objectInputsController.name"
            [position]="objectInputsController.position"
            [rotation]="objectInputsController.rotation"
            [quaternion]="objectInputsController.quaternion"
            [color]="objectInputsController.color"
            [userData]="objectInputsController.userData"
            [castShadow]="objectInputsController.castShadow"
            [receiveShadow]="objectInputsController.receiveShadow"
            [visible]="objectInputsController.visible"
            [matrixAutoUpdate]="objectInputsController.matrixAutoUpdate"
            [dispose]="objectInputsController.dispose"
            [raycast]="objectInputsController.raycast"
            [appendMode]="objectInputsController.appendMode"
            [appendTo]="objectInputsController.appendTo"
            (click)="objectInputsController.click.emit($event)"
            (contextmenu)="objectInputsController.contextmenu.emit($event)"
            (dblclick)="objectInputsController.dblclick.emit($event)"
            (pointerup)="objectInputsController.pointerup.emit($event)"
            (pointerdown)="objectInputsController.pointerdown.emit($event)"
            (pointerover)="objectInputsController.pointerover.emit($event)"
            (pointerout)="objectInputsController.pointerout.emit($event)"
            (pointerenter)="objectInputsController.pointerenter.emit($event)"
            (pointerleave)="objectInputsController.pointerleave.emit($event)"
            (pointermove)="objectInputsController.pointermove.emit($event)"
            (pointermissed)="objectInputsController.pointermissed.emit($event)"
            (pointercancel)="objectInputsController.pointercancel.emit($event)"
            (wheel)="objectInputsController.wheel.emit($event)"
            (ready)="object = $event"
            (animateReady)="
                animateReady.emit({ entity: object, state: $event.state })
            "
        >
            <ng-container
                *ngIf="object"
                [ngTemplateOutlet]="contentTemplate"
            ></ng-container>
        </ngt-mesh>
        <ng-template #contentTemplate>
            <ng-content></ng-content>
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
        NgtTextureLoader,
        createExtenderProvider(NgtSobaImage),
        createParentObjectProvider(NgtSobaImage, (image) => image.object),
        createHostParentObjectProvider(NgtSobaImage),
    ],
})
export class NgtSobaImage extends NgtExtender<THREE.Mesh> implements OnChanges {
    @Input() segments?: number;
    @Input() scale?: number;
    @Input() color?: NgtColor;
    @Input() zoom?: number;
    @Input() grayscale?: number;

    @Input() set url(v: string) {
        this.texture$ = this.textureLoader.load(v).pipe(
            tap((texture) => {
                this.imageBounds = [texture.image.width, texture.image.height];
            })
        );
    }

    planeBounds?: [number, number];
    imageBounds?: [number, number];

    texture$?: Observable<THREE.Texture>;

    constructor(
        private textureLoader: NgtTextureLoader,
        @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
        public objectInputsController: NgtObjectInputsController,
        @Optional()
        @SkipSelf()
        @Inject(NGT_PARENT_OBJECT)
        public parentObjectFn: AnyFunction
    ) {
        super();
    }

    ngOnChanges() {
        this.planeBounds = Array.isArray(this.scale)
            ? [this.scale[0], this.scale[1]]
            : [this.scale, this.scale];
    }
}

@NgModule({
    declarations: [NgtSobaImage],
    exports: [NgtSobaImage, NgtObjectInputsControllerModule],
    imports: [
        NgtSobaImageShaderMaterialModule,
        NgtMeshModule,
        NgtPlaneGeometryModule,
        CommonModule,
    ],
})
export class NgtSobaImageModule {}
