import {
    AnyFunction,
    applyProps,
    createExtenderProvider,
    createHostParentObjectProvider,
    createParentObjectProvider,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
    NGT_PARENT_OBJECT,
    NGT_WITH_MATERIAL_CONTROLLER_PROVIDER,
    NGT_WITH_MATERIAL_WATCHED_CONTROLLER,
    NgtCanvasStore,
    NgtColor,
    NgtExtender,
    NgtLoop,
    NgtObjectInputsController,
    NgtObjectInputsControllerModule,
    NgtStore,
    NgtVector4,
    NgtWithMaterialController,
    NgtWithMaterialControllerModule,
    tapEffect,
} from '@angular-three/core';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    NgModule,
    NgZone,
    OnInit,
    Optional,
    Output,
    SkipSelf,
} from '@angular/core';
// @ts-ignore
import { Text as TextMeshImpl } from 'troika-three-text';

interface NgtSobaTextState {
    object: TextMeshImpl;
    text: string;
    anchorX: number | 'left' | 'center' | 'right';
    anchorY:
        | number
        | 'top'
        | 'top-baseline'
        | 'middle'
        | 'bottom-baseline'
        | 'bottom';
    color?: NgtColor;
    fontSize?: number;
    maxWidth?: number;
    lineHeight?: number;
    letterSpacing?: number;
    textAlign?: 'left' | 'right' | 'center' | 'justify';
    font?: string;
    clipRect?: NgtVector4;
    depthOffset?: number;
    direction?: 'auto' | 'ltr' | 'rtl';
    overflowWrap?: 'normal' | 'break-word';
    whiteSpace?: 'normal' | 'overflowWrap' | 'overflowWrap';
    outlineWidth?: number | string;
    outlineOffsetX?: number | string;
    outlineOffsetY?: number | string;
    outlineBlur?: number | string;
    outlineColor?: NgtColor;
    outlineOpacity?: number;
    strokeWidth?: number | string;
    strokeColor?: NgtColor;
    strokeOpacity?: number;
    fillOpacity?: number;
    debugSDF?: boolean;
}

@Component({
    selector: 'ngt-soba-text',
    template: `
        <ngt-primitive
            *ngIf="object"
            [object]="$any(object)"
            [name]="objectInputsController.name"
            [position]="objectInputsController.position"
            [rotation]="objectInputsController.rotation"
            [quaternion]="objectInputsController.quaternion"
            [scale]="objectInputsController.scale"
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
            (animateReady)="
                animateReady.emit({ entity: object, state: $event.state })
            "
        >
            <ng-container [ngTemplateOutlet]="contentTemplate"></ng-container>
        </ngt-primitive>
        <ng-template #contentTemplate>
            <ng-content></ng-content>
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NgtStore,
        NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
        NGT_WITH_MATERIAL_CONTROLLER_PROVIDER,
        createExtenderProvider(NgtSobaText),
        createParentObjectProvider(NgtSobaText, (text) => text.object),
        createHostParentObjectProvider(NgtSobaText),
    ],
})
export class NgtSobaText extends NgtExtender<TextMeshImpl> implements OnInit {
    @Input() set text(text: string) {
        this.store.set({ text: text.trim() });
    }

    @Input() set color(color: NgtColor) {
        this.store.set({ color });
    }

    @Input() set fontSize(fontSize: number) {
        this.store.set({ fontSize });
    }

    @Input() set maxWidth(maxWidth: number) {
        this.store.set({ maxWidth });
    }

    @Input() set lineHeight(lineHeight: number) {
        this.store.set({ lineHeight });
    }

    @Input() set letterSpacing(letterSpacing: number) {
        this.store.set({ letterSpacing });
    }

    @Input() set textAlign(textAlign: 'left' | 'right' | 'center' | 'justify') {
        this.store.set({ textAlign });
    }

    @Input() set font(font: string) {
        this.store.set({ font });
    }

    @Input() set clipRect(clipRect: NgtVector4) {
        this.store.set({ clipRect });
    }

    @Input() set depthOffset(depthOffset: number) {
        this.store.set({ depthOffset });
    }

    @Input() set direction(direction: 'auto' | 'ltr' | 'rtl') {
        this.store.set({ direction });
    }

    @Input() set overflowWrap(overflowWrap: 'normal' | 'break-word') {
        this.store.set({ overflowWrap });
    }

    @Input() set whiteSpace(
        whiteSpace: 'normal' | 'overflowWrap' | 'overflowWrap'
    ) {
        this.store.set({ whiteSpace });
    }

    @Input() set outlineWidth(outlineWidth: number | string) {
        this.store.set({ outlineWidth });
    }

    @Input() set outlineOffsetX(outlineOffsetX: number | string) {
        this.store.set({ outlineOffsetX });
    }

    @Input() set outlineOffsetY(outlineOffsetY: number | string) {
        this.store.set({ outlineOffsetY });
    }

    @Input() set outlineBlur(outlineBlur: number | string) {
        this.store.set({ outlineBlur });
    }

    @Input() set outlineColor(outlineColor: NgtColor) {
        this.store.set({ outlineColor });
    }

    @Input() set outlineOpacity(outlineOpacity: number) {
        this.store.set({ outlineOpacity });
    }

    @Input() set strokeWidth(strokeWidth: number | string) {
        this.store.set({ strokeWidth });
    }

    @Input() set strokeColor(strokeColor: NgtColor) {
        this.store.set({ strokeColor });
    }

    @Input() set strokeOpacity(strokeOpacity: number) {
        this.store.set({ strokeOpacity });
    }

    @Input() set fillOpacity(fillOpacity: number) {
        this.store.set({ fillOpacity });
    }

    @Input() set debugSDF(debugSDF: boolean) {
        this.store.set({ debugSDF });
    }

    @Input() set anchorX(anchorX: number | 'left' | 'center' | 'right') {
        this.store.set({ anchorX });
    }

    @Input() set anchorY(
        anchorY:
            | number
            | 'top'
            | 'top-baseline'
            | 'middle'
            | 'bottom-baseline'
            | 'bottom'
    ) {
        this.store.set({ anchorY });
    }

    @Output() sync = new EventEmitter<TextMeshImpl>();

    constructor(
        @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
        public objectInputsController: NgtObjectInputsController,
        @Inject(NGT_WITH_MATERIAL_WATCHED_CONTROLLER)
        private contentMaterialController: NgtWithMaterialController,
        private elRef: ElementRef<HTMLElement>,
        private loop: NgtLoop,
        private store: NgtStore<NgtSobaTextState>,
        private canvasStore: NgtCanvasStore,
        private zone: NgZone,
        @Optional()
        @SkipSelf()
        @Inject(NGT_PARENT_OBJECT)
        public parentObjectFn: AnyFunction
    ) {
        super();
        store.set({
            object: new TextMeshImpl(),
            text: '',
            anchorX: 'center',
            anchorY: 'middle',
        });
    }

    private readonly init = this.store.effect<TextMeshImpl>(
        tapEffect((textMesh) => {
            this.object = textMesh;

            if (this.contentMaterialController.material) {
                this.object.material = this.contentMaterialController.material;
            }

            return () => {
                this.object.dispose();
            };
        })
    );

    private readonly applyProps = this.store.effect<NgtSobaTextState>(
        tapEffect(({ object, ...props }) => {
            const id = requestAnimationFrame(() => {
                applyProps(object, props as Omit<NgtSobaTextState, 'object'>);
                object.sync(() => {
                    this.loop.invalidate();
                    if (this.sync.observed) {
                        this.sync.emit(object);
                    }
                });
            });

            return () => {
                cancelAnimationFrame(id);
            };
        })
    );

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.store.onCanvasReady(this.canvasStore.ready$, () => {
                this.init(this.store.select((s) => s.object));
                this.applyProps(this.store.select());
            });
        });
    }
}

@NgModule({
    declarations: [NgtSobaText],
    exports: [
        NgtSobaText,
        NgtObjectInputsControllerModule,
        NgtWithMaterialControllerModule,
    ],
    imports: [CommonModule, NgtPrimitiveModule],
})
export class NgtSobaTextModule {}
