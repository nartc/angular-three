import {
  NgtAnimationFrameStore,
  NgtCanvasStore,
  NgtStore,
} from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  Inject,
  Input,
  NgModule,
  NgZone,
  OnInit,
} from '@angular/core';
import Stats from 'three/examples/jsm/libs/stats.module';

@Directive({
  selector: 'ngt-stats',
  exportAs: 'ngtStats',
})
export class NgtStats extends NgtStore implements OnInit {
  @Input() parent?: HTMLElement;

  private node: HTMLElement;
  private stats?: Stats;
  private animationUuid = '';

  constructor(
    private zone: NgZone,
    private animationFrameStore: NgtAnimationFrameStore,
    private canvasStore: NgtCanvasStore,
    @Inject(DOCUMENT) document: Document
  ) {
    super();
    this.node = document.body;
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(
        this.canvasStore.ready$,
        () => {
          if (this.parent) {
            this.node = this.parent;
          }

          this.stats = Stats();
          this.node.appendChild(this.stats.dom);
          this.animationUuid = this.animationFrameStore.register({
            callback: this.stats.update.bind(this.stats),
          });
          return () => {
            if (this.stats) {
              this.animationFrameStore.unregister(this.animationUuid);
              this.stats.end();
              this.node.removeChild(this.stats.dom);
            }
          };
        },
        true
      );
    });
  }
}

@NgModule({
  declarations: [NgtStats],
  exports: [NgtStats],
})
export class NgtStatsModule {}
