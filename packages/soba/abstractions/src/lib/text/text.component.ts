import {
  applyProps,
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtColor,
  NgtCommonMesh,
  NgtCoreModule,
  NgtObject3d,
  NgtPrimitiveModule,
} from '@angular-three/core';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
// @ts-ignore
import { Text as TextMeshImpl } from 'troika-three-text';
import { NgtTextContent } from './text-content.directive';

@Component({
  selector: 'ngt-text',
  exportAs: 'ngtText',
  template: `
    <ng-container *ngIf="object3d">
      <ngt-primitive
        [object]="object3d"
        (ready)="onTroikaTextReady($event)"
      ></ngt-primitive>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NgtObject3d, useExisting: NgtText },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtText
  extends NgtCommonMesh<TextMeshImpl>
  implements OnChanges, OnDestroy, OnInit
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
  @Input() clipRect?: [number, number, number, number];
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

  @ContentChild(NgtTextContent, { static: true }) textContent!: NgtTextContent;

  ngOnInit() {
    if (!this.textContent) {
      console.warn(
        '<ngt-text> should have a <ngt-text-content> as a content child.'
      );
    }
  }

  ngOnChanges() {
    this.ngZone.runOutsideAngular(() => {
      if (this.object3d && this.textContent) {
        this.object3d.sync(() => {
          this.sync.emit(this.object3d);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.object3d && this.textContent) {
        this.object3d.dispose();
      }
    });
  }

  meshType = TextMeshImpl;

  onTroikaTextReady(troikaText: TextMeshImpl) {
    this.ngZone.runOutsideAngular(() => {
      if (this.textContent) {
        troikaText.text = this.textContent.text;
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
      }
    });
  }
}

@NgModule({
  declarations: [NgtText, NgtTextContent],
  exports: [NgtText, NgtTextContent],
  imports: [NgtPrimitiveModule, NgtCoreModule, CommonModule],
})
export class NgtTextModule {}
