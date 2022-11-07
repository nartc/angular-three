import {
  AnyConstructor,
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  is,
  NgtColor,
  NgtMaterialGeometry,
  NumberInput,
  provideMaterialGeometryRef,
  provideNgtMaterialGeometry,
  tapEffect,
} from '@angular-three/core';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { asapScheduler, observeOn, pipe, tap } from 'rxjs';
// @ts-ignore
import { preloadFont, Text as TextMeshImpl } from 'troika-three-text';

@Component({
  selector: 'ngt-soba-text',
  standalone: true,
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtMaterialGeometry(NgtSobaText),
    provideMaterialGeometryRef(NgtSobaText),
  ],
})
export class NgtSobaText extends NgtMaterialGeometry<TextMeshImpl> {
  override get objectType(): AnyConstructor<TextMeshImpl> {
    return TextMeshImpl;
  }

  @Input() set text(text: string) {
    this.set({ text });
  }

  @Input() set characters(characters: string) {
    this.set({ characters });
  }

  @Input() set fontSize(fontSize: NumberInput) {
    this.set({ fontSize: coerceNumberProperty(fontSize) });
  }

  @Input() set maxWidth(maxWidth: NumberInput) {
    this.set({ maxWidth: coerceNumberProperty(maxWidth) });
  }

  @Input() set lineHeight(lineHeight: NumberInput) {
    this.set({ lineHeight: coerceNumberProperty(lineHeight) });
  }

  @Input() set letterSpacing(letterSpacing: NumberInput) {
    this.set({ letterSpacing: coerceNumberProperty(letterSpacing) });
  }

  @Input() set textAlign(textAlign: 'left' | 'right' | 'center' | 'justify') {
    this.set({ textAlign });
  }

  @Input() set font(font: string) {
    this.set({ font });
  }

  @Input() set anchorX(anchorX: number | 'left' | 'center' | 'right') {
    this.set({ anchorX });
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
    this.set({ anchorY });
  }

  @Input() set clipRect(clipRect: [number, number, number, number]) {
    this.set({ clipRect });
  }

  @Input() set depthOffset(depthOffset: NumberInput) {
    this.set({ depthOffset: coerceNumberProperty(depthOffset) });
  }

  @Input() set direction(direction: 'auto' | 'ltr' | 'rtl') {
    this.set({ direction });
  }

  @Input() set overflowWrap(overflowWrap: 'normal' | 'break-word') {
    this.set({ overflowWrap });
  }

  @Input() set whiteSpace(
    whiteSpace: 'normal' | 'overflowWrap' | 'overflowWrap'
  ) {
    this.set({ whiteSpace });
  }

  @Input() set outlineWidth(outlineWidth: number | string) {
    this.set({
      outlineWidth: coerceNumberProperty(outlineWidth, outlineWidth),
    });
  }

  @Input() set outlineOffsetX(outlineOffsetX: number | string) {
    this.set({
      outlineOffsetX: coerceNumberProperty(outlineOffsetX, outlineOffsetX),
    });
  }

  @Input() set outlineOffsetY(outlineOffsetY: number | string) {
    this.set({
      outlineOffsetY: coerceNumberProperty(outlineOffsetY, outlineOffsetY),
    });
  }

  @Input() set outlineBlur(outlineBlur: number | string) {
    this.set({
      outlineBlur: coerceNumberProperty(outlineBlur, outlineBlur),
    });
  }

  @Input() set outlineColor(outlineColor: NgtColor) {
    this.set({ outlineColor });
  }

  @Input() set outlineOpacity(outlineOpacity: NumberInput) {
    this.set({ outlineOpacity: coerceNumberProperty(outlineOpacity) });
  }

  @Input() set strokeWidth(strokeWidth: number | string) {
    this.set({
      strokeWidth: coerceNumberProperty(strokeWidth, strokeWidth),
    });
  }

  @Input() set strokeColor(strokeColor: NgtColor) {
    this.set({ strokeColor });
  }

  @Input() set strokeOpacity(strokeOpacity: NumberInput) {
    this.set({ strokeOpacity: coerceNumberProperty(strokeOpacity) });
  }

  @Input() set fillOpacity(fillOpacity: NumberInput) {
    this.set({ fillOpacity: coerceNumberProperty(fillOpacity) });
  }

  @Input() set debugSDF(debugSDF: BooleanInput) {
    this.set({ debugSDF: coerceBooleanProperty(debugSDF) });
  }

  @Output() sync = new EventEmitter<TextMeshImpl>();

  readonly #preloadFont = this.effect<void>(
    tap(() => {
      const { font, characters } = this.get();
      if (font && characters) {
        preloadFont({ font, characters });
      }
    })
  );

  readonly #textReady = this.effect<void>(
    pipe(
      observeOn(asapScheduler),
      tapEffect(() => {
        // if material is an NgtInstance
        // then delete the default color
        if (is.instance(this.instanceValue.material)) {
          delete this.instanceValue.color;
        }
        return () => {
          this.instanceValue.dispose();
        };
      })
    )
  );

  override preStoreReady() {
    super.preStoreReady();
    this.#preloadFont();
  }

  override preInit() {
    super.preInit();
    this.set((s) => ({
      anchorX: s['anchorX'] || 'center',
      anchorY: s['anchorY'] || 'middle',
      text: s['text'] || '',
    }));
    this.#textReady(this.ready);
  }

  override postSetOptions(textMesh: TextMeshImpl) {
    const invalidate = this.store.get((s) => s.invalidate);
    textMesh.sync(() => {
      invalidate();
      if (this.sync.observed) {
        this.sync.emit(textMesh);
      }
    });
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      text: false,
      characters: true,
      fontSize: true,
      maxWidth: true,
      lineHeight: true,
      letterSpacing: true,
      textAlign: true,
      font: true,
      anchorX: false,
      anchorY: false,
      clipRect: true,
      depthOffset: true,
      direction: true,
      overflowWrap: true,
      whiteSpace: true,
      outlineWidth: true,
      outlineOffsetX: true,
      outlineOffsetY: true,
      outlineBlur: true,
      outlineColor: true,
      outlineOpacity: true,
      strokeWidth: true,
      strokeColor: true,
      strokeOpacity: true,
      fillOpacity: true,
      debugSDF: true,
    };
  }
}
