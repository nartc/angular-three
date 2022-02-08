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
  OnDestroy,
  OnInit,
} from '@angular/core';
import Stats from 'three/examples/jsm/libs/stats.module';

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
    @Inject(DOCUMENT) document: Document
  ) {
    this.node = document.body;
  }

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      if (this.parent) {
        this.node = this.parent;
      }

      this.stats = Stats();
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
