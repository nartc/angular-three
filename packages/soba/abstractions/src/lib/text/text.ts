import { injectNgtRef, injectNgtStore, NgtArgs, NgtRxStore } from '@angular-three/core';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { RxActionFactory } from '@rx-angular/state/actions';
// @ts-ignore
import { preloadFont, Text } from 'troika-three-text';

@Component({
  selector: 'ngts-text[text]',
  standalone: true,
  template: `
    <ngt-primitive
      ngtCompound
      *args="[textRef.nativeElement]"
      [text]="get('text')"
      [anchorX]="get('anchorX')"
      [anchorY]="get('anchorY')"
      [font]="get('font')"
    >
      <ng-content />
    </ngt-primitive>
  `,
  imports: [NgtArgs],
  providers: [RxActionFactory],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsText extends NgtRxStore implements OnInit, OnDestroy {
  @Input() textRef = injectNgtRef<Text>();

  @Input() set text(text: string) {
    this.set({ text });
  }

  @Input() set characters(characters: string) {
    this.set({ characters });
  }

  @Input() set font(font: string) {
    this.set({ font });
  }

  @Input() set anchorX(anchorX: number | 'left' | 'center' | 'right') {
    this.set({ anchorX });
  }

  @Input() set anchorY(
    anchorY: number | 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom'
  ) {
    this.set({ anchorY });
  }

  @Output() sync = new EventEmitter<Text>();

  override initialize(): void {
    super.initialize();
    this.set({ anchorX: 'center', anchorY: 'middle', text: '' });
  }

  readonly #store = injectNgtStore();
  readonly #actions = inject(RxActionFactory<{ preloadFont: void }>).create();
  readonly #text = new Text();

  ngOnInit(): void {
    if (!this.textRef.nativeElement) this.textRef.nativeElement = this.#text;
    this.#preloadFont();
    this.#sync();
  }

  override ngOnDestroy(): void {
    this.#text.dispose();
    super.ngOnDestroy();
  }

  #preloadFont() {
    this.hold(this.#actions.preloadFont$, () => {
      const { font, characters } = this.get();
      if (font && characters) {
        preloadFont({ font, characters });
      }
    });
    this.#actions.preloadFont();
  }

  #sync() {
    this.hold(this.select(), () => {
      const invalidate = this.#store.get('invalidate');
      this.#text.sync(() => {
        invalidate();
        if (this.sync.observed) this.sync.next(this.#text);
      });
    });
  }
}
