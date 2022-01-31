import {
  NgtAnimationFrameStore,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  Inject,
  Input,
  NgModule,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
// import Stats from minified bundle for minimizing bundle size
// @ts-ignore
import Stats from 'three/examples/js/libs/stats.min';

@Directive({
  selector: 'ngt-stats',
  exportAs: 'ngtStats',
})
export class NgtStats implements OnInit, OnDestroy {
  @Input() parent?: HTMLElement;

  private node: HTMLElement;
  private stats?: Stats;
  private animationUuid = '';

  constructor(
    private animationFrameStore: NgtAnimationFrameStore,
    private zone: NgZone,
    @Inject(DOCUMENT) document: Document
  ) {
    this.node = document.body;
  }

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      if (this.parent) {
        this.node = this.parent;
      }

      this.stats = new Stats();
      this.node.appendChild(this.stats.dom);
      this.animationUuid = this.animationFrameStore.register({
        callback: this.stats.update.bind(this.stats),
      });
    });
  }

  ngOnDestroy() {
    zonelessRequestAnimationFrame(() => {
      if (this.stats) {
        this.animationFrameStore.actions.unregister(this.animationUuid);
        this.stats.end();
        this.node.removeChild(this.stats.dom);
      }
    });
  }
}

@NgModule({
  declarations: [NgtStats],
  exports: [NgtStats],
})
export class NgtStatsModule {}
