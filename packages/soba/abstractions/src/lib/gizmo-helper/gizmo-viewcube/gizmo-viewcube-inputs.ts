import { injectNgtStore, NgtRxStore, NgtThreeEvent } from '@angular-three/core';
import { Directive, EventEmitter, Input } from '@angular/core';

@Directive()
export abstract class NgtsGizmoViewcubeInputs extends NgtRxStore {
  protected readonly store = injectNgtStore();

  @Input() set opacity(opacity: number) {
    this.set({ opacity: opacity === undefined ? this.get('opacity') : opacity });
  }

  @Input() set hoverColor(hoverColor: string) {
    this.set({ hoverColor: hoverColor === undefined ? this.get('hoverColor') : hoverColor });
  }

  @Input() set textColor(textColor: string) {
    this.set({ textColor: textColor === undefined ? this.get('textColor') : textColor });
  }

  @Input() set strokeColor(strokeColor: string) {
    this.set({ strokeColor: strokeColor === undefined ? this.get('strokeColor') : strokeColor });
  }

  @Input() set faces(faces: string[]) {
    this.set({ faces: faces === undefined ? this.get('faces') : faces });
  }

  @Input() set clickEmitter(clickEmitter: EventEmitter<NgtThreeEvent<MouseEvent>>) {
    this.set({ clickEmitter });
  }
}
