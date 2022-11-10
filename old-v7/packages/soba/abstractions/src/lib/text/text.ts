import {
  coerceBoolean,
  coerceNumber,
  is,
  NgtAnyConstructor,
  NgtBooleanInput,
  NgtColor,
  NgtCommonMesh,
  NgtNumberInput,
  provideCommonMeshRef,
  provideNgtCommonMesh,
  tapEffect,
} from '@angular-three/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animationFrameScheduler, observeOn, tap } from 'rxjs';
// @ts-ignore
import { preloadFont, Text as TextMeshImpl } from 'troika-three-text';

@Component({
  selector: 'ngt-soba-text',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMesh(NgtSobaText), provideCommonMeshRef(NgtSobaText)],
})
export class NgtSobaText extends NgtCommonMesh<TextMeshImpl> {
  override get meshType(): NgtAnyConstructor<TextMeshImpl> {
    return TextMeshImpl;
  }

  @Input() set text(text: string) {
    this.set({ text });
  }

  @Input() set characters(characters: string) {
    this.set({ characters });
  }

  @Input() set fontSize(fontSize: NgtNumberInput) {
    this.set({ fontSize: coerceNumber(fontSize) });
  }

  @Input() set maxWidth(maxWidth: NgtNumberInput) {
    this.set({ maxWidth: coerceNumber(maxWidth) });
  }

  @Input() set lineHeight(lineHeight: NgtNumberInput) {
    this.set({ lineHeight: coerceNumber(lineHeight) });
  }

  @Input() set letterSpacing(letterSpacing: NgtNumberInput) {
    this.set({ letterSpacing: coerceNumber(letterSpacing) });
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

  @Input() set anchorY(anchorY: number | 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom') {
    this.set({ anchorY });
  }

  @Input() set clipRect(clipRect: [number, number, number, number]) {
    this.set({ clipRect });
  }

  @Input() set depthOffset(depthOffset: NgtNumberInput) {
    this.set({ depthOffset: coerceNumber(depthOffset) });
  }

  @Input() set direction(direction: 'auto' | 'ltr' | 'rtl') {
    this.set({ direction });
  }

  @Input() set overflowWrap(overflowWrap: 'normal' | 'break-word') {
    this.set({ overflowWrap });
  }

  @Input() set whiteSpace(whiteSpace: 'normal' | 'overflowWrap') {
    this.set({ whiteSpace });
  }

  @Input() set outlineWidth(outlineWidth: number | string) {
    this.set({
      outlineWidth: coerceNumber(outlineWidth, outlineWidth),
    });
  }

  @Input() set outlineOffsetX(outlineOffsetX: number | string) {
    this.set({
      outlineOffsetX: coerceNumber(outlineOffsetX, outlineOffsetX),
    });
  }

  @Input() set outlineOffsetY(outlineOffsetY: number | string) {
    this.set({
      outlineOffsetY: coerceNumber(outlineOffsetY, outlineOffsetY),
    });
  }

  @Input() set outlineBlur(outlineBlur: number | string) {
    this.set({
      outlineBlur: coerceNumber(outlineBlur, outlineBlur),
    });
  }

  @Input() set outlineColor(outlineColor: NgtColor) {
    this.set({ outlineColor });
  }

  @Input() set outlineOpacity(outlineOpacity: NgtNumberInput) {
    this.set({ outlineOpacity: coerceNumber(outlineOpacity) });
  }

  @Input() set strokeWidth(strokeWidth: number | string) {
    this.set({
      strokeWidth: coerceNumber(strokeWidth, strokeWidth),
    });
  }

  @Input() set strokeColor(strokeColor: NgtColor) {
    this.set({ strokeColor });
  }

  @Input() set strokeOpacity(strokeOpacity: NgtNumberInput) {
    this.set({ strokeOpacity: coerceNumber(strokeOpacity) });
  }

  @Input() set fillOpacity(fillOpacity: NgtNumberInput) {
    this.set({ fillOpacity: coerceNumber(fillOpacity) });
  }

  @Input() set debugSDF(debugSDF: NgtBooleanInput) {
    this.set({ debugSDF: coerceBoolean(debugSDF) });
  }

  @Output() sync = new EventEmitter<TextMeshImpl>();

  private readonly preLoadFont = this.effect<void>(
    tap(() => {
      const { font, characters } = this.getState();
      if (font && characters) {
        preloadFont({ font, characters });
      }
    })
  );

  private readonly textReady = this.effect<void>(
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
  );

  override preStoreReady() {
    super.preStoreReady();
    this.preLoadFont();
  }

  override initialize() {
    super.initialize();
    this.set((s) => ({
      anchorX: s['anchorX'] ?? 'center',
      anchorY: s['anchorY'] ?? 'middle',
      text: s['text'] ?? '',
    }));
  }

  override postInit() {
    super.postInit();
    this.textReady(this.ready.pipe(observeOn(animationFrameScheduler)));
  }

  override postSetOptions(textMesh: TextMeshImpl) {
    const invalidate = this.store.getState((s) => s.invalidate);
    textMesh.sync(() => {
      invalidate();
      if (this.sync.observed) {
        this.sync.emit(textMesh);
      }
    });
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'text',
      'characters',
      'fontSize',
      'maxWidth',
      'lineHeight',
      'letterSpacing',
      'textAlign',
      'font',
      'anchorX',
      'anchorY',
      'clipRect',
      'depthOffset',
      'direction',
      'overflowWrap',
      'whiteSpace',
      'outlineWidth',
      'outlineOffsetX',
      'outlineOffsetY',
      'outlineBlur',
      'outlineColor',
      'outlineOpacity',
      'strokeWidth',
      'strokeColor',
      'strokeOpacity',
      'fillOpacity',
      'debugSDF',
    ];
  }
}
