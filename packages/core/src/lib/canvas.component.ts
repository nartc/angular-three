import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngt-canvas',
  exportAs: 'ngtCanvas',
  template: ` <canvas #rendererCanvas></canvas> `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      :host canvas {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
