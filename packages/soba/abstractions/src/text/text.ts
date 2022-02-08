import {
  applyProps,
  createExtenderProvider,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NGT_OBJECT_WATCHED_CONTROLLER,
  NGT_WITH_MATERIAL_CONTROLLER_PROVIDER,
  NGT_WITH_MATERIAL_WATCHED_CONTROLLER,
  NgtColor,
  NgtExtender,
  NgtLoop,
  NgtObjectController,
  NgtObjectInputsController,
  NgtObjectInputsControllerModule,
  NgtVector4,
  NgtWithMaterialController,
  NgtWithMaterialControllerModule,
  zonelessRequestAnimationFrame,
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
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';
// @ts-ignore
import { Text as TextMeshImpl } from 'troika-three-text';

@Component({
  selector: 'ngt-soba-text',
  template: `
    <ng-container *ngIf="object">
      <ngt-primitive
        name="soba-text"
        [object]="$any(object)"
        [objectInputsController]="objectInputsController"
        (ready)="onTroikaTextReady(object)"
        (animateReady)="
          animateReady.emit({ entity: object, state: $event.state })
        "
      >
      </ngt-primitive>
    </ng-container>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_WITH_MATERIAL_CONTROLLER_PROVIDER,
    createExtenderProvider(NgtSobaText),
  ],
})
export class NgtSobaText
  extends NgtExtender<TextMeshImpl>
  implements OnInit, OnChanges, OnDestroy
{
  @Input() color?: NgtColor;
  @Input() fontSize?: number;
  @Input() maxWidth?: number;
  @Input() lineHeight?: number;
  @Input() letterSpacing?: number;
  @Input() textAlign?: 'left' | 'right' | 'center' | 'justify';
  @Input() font?: string;
  @Input() anchorX: number | 'left' | 'center' | 'right' = 'center';
  @Input() anchorY:
    | number
    | 'top'
    | 'top-baseline'
    | 'middle'
    | 'bottom-baseline'
    | 'bottom' = 'middle';
  @Input() clipRect?: NgtVector4;
  @Input() depthOffset?: number;
  @Input() direction?: 'auto' | 'ltr' | 'rtl';
  @Input() overflowWrap?: 'normal' | 'break-word';
  @Input() whiteSpace?: 'normal' | 'overflowWrap' | 'overflowWrap';
  @Input() outlineWidth?: number | string;
  @Input() outlineOffsetX?: number | string;
  @Input() outlineOffsetY?: number | string;
  @Input() outlineBlur?: number | string;
  @Input() outlineColor?: NgtColor;
  @Input() outlineOpacity?: number;
  @Input() strokeWidth?: number | string;
  @Input() strokeColor?: NgtColor;
  @Input() strokeOpacity?: number;
  @Input() fillOpacity?: number;
  @Input() debugSDF?: boolean;

  @Output() sync = new EventEmitter<TextMeshImpl>();

  private _text = '';
  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value.trim();
  }

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObjectInputsController,
    @Inject(NGT_WITH_MATERIAL_WATCHED_CONTROLLER)
    private contentMaterialController: NgtWithMaterialController,
    private elRef: ElementRef<HTMLElement>,
    private loop: NgtLoop,
    @Optional()
    @SkipSelf()
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    hostParent: NgtObjectController
  ) {
    super();
    console.log(hostParent);
    this.object = new TextMeshImpl();
  }

  ngOnChanges() {
    zonelessRequestAnimationFrame(() => {
      if (this.object) {
        this.object.sync(() => {
          this.loop.invalidate();
          if (this.sync.observed) {
            this.sync.emit(this.object);
          }
        });
      }
    });
  }

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      this.elRef.nativeElement.childNodes.forEach((childNode) => {
        if (childNode instanceof Text) {
          this.text += childNode.textContent;
        }
      });
    });
  }

  ngOnDestroy() {
    zonelessRequestAnimationFrame(() => {
      if (this.object) {
        this.object.dispose?.();
      }
    });
  }

  onTroikaTextReady(troikaText: TextMeshImpl) {
    zonelessRequestAnimationFrame(() => {
      troikaText.text = this.text;
      if (this.contentMaterialController.material) {
        troikaText.material = this.contentMaterialController.material;
      }
      applyProps(troikaText, {
        color: this.color,
        fontSize: this.fontSize,
        maxWidth: this.maxWidth,
        lineHeight: this.lineHeight,
        letterSpacing: this.letterSpacing,
        textAlign: this.textAlign,
        font: this.font,
        anchorX: this.anchorX,
        anchorY: this.anchorY,
        clipRect: this.clipRect,
        depthOffset: this.depthOffset,
        direction: this.direction,
        overflowWrap: this.overflowWrap,
        whiteSpace: this.whiteSpace,
        outlineWidth: this.outlineWidth,
        outlineOffsetX: this.outlineOffsetX,
        outlineOffsetY: this.outlineOffsetY,
        outlineBlur: this.outlineBlur,
        outlineColor: this.outlineColor,
        outlineOpacity: this.outlineOpacity,
        strokeWidth: this.strokeWidth,
        strokeColor: this.strokeColor,
        strokeOpacity: this.strokeOpacity,
        fillOpacity: this.fillOpacity,
        debugSDF: this.debugSDF,
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
