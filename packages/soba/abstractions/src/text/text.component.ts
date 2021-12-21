import {
  applyProps,
  NGT_CONTENT_MATERIAL_CONTROLLER_PROVIDER,
  NGT_CONTENT_MATERIAL_WATCHED_CONTROLLER,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtColor,
  NgtContentMaterialController,
  NgtContentMaterialControllerModule,
  NgtLoopService,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
  NgtSobaExtender,
  NgtVector4,
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
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { requestAnimationFrame } from '@rx-angular/cdk/zone-less';
// @ts-ignore
import { Text as TextMeshImpl } from 'troika-three-text';

@Component({
  selector: 'ngt-soba-text',
  template: `
    <ng-container *ngIf="object">
      <ngt-primitive
        [object]="$any(object)"
        [object3dInputsController]="objectInputsController"
        (ready)="onTroikaTextReady(object)"
      >
      </ngt-primitive>
    </ng-container>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_CONTENT_MATERIAL_CONTROLLER_PROVIDER,
    { provide: NgtSobaExtender, useExisting: NgtSobaText },
  ],
})
export class NgtSobaText
  extends NgtSobaExtender<TextMeshImpl>
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

  #text = '';
  get text(): string {
    return this.#text;
  }

  set text(value: string) {
    this.#text = value.trim();
  }

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    @Inject(NGT_CONTENT_MATERIAL_WATCHED_CONTROLLER)
    private contentMaterialController: NgtContentMaterialController,
    private elRef: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    private loopService: NgtLoopService
  ) {
    super();
    ngZone.runOutsideAngular(() => {
      this.object = new TextMeshImpl();
    });
  }

  ngOnChanges() {
    this.ngZone.runOutsideAngular(() => {
      if (this.object) {
        this.object.sync(() => {
          this.loopService.invalidate();
          if (this.sync.observed) {
            this.sync.emit(this.object);
          }
        });
      }
    });
  }

  ngOnInit() {
    requestAnimationFrame(() => {
      this.elRef.nativeElement.childNodes.forEach((childNode) => {
        if (childNode instanceof Text) {
          this.text += childNode.textContent;
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.object) {
      this.object.dispose();
    }
  }

  onTroikaTextReady(troikaText: TextMeshImpl) {
    requestAnimationFrame(() => {
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
    NgtObject3dInputsControllerModule,
    NgtContentMaterialControllerModule,
  ],
  imports: [CommonModule, NgtPrimitiveModule],
})
export class NgtSobaTextModule {}
