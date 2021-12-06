import { NgtAnimationFrameStore } from '@angular-three/core';
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
import { Subscription } from 'rxjs';
// import Stats from minified bundle for minimizing bundle size
// @ts-ignore
import Stats from 'three/examples/js/libs/stats.min';

@Directive({
  selector: 'ngt-stats',
  exportAs: 'ngtStats',
})
export class NgtStats implements OnInit, OnDestroy {
  @Input() parent?: HTMLElement;

  #node: HTMLElement;
  #stats?: Stats;
  #animationSubscription?: Subscription;

  constructor(
    private animationFrameStore: NgtAnimationFrameStore,
    private ngZone: NgZone,
    @Inject(DOCUMENT) document: Document
  ) {
    this.#node = document.body;
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.parent) {
        this.#node = this.parent;
      }

      this.#stats = new Stats();
      this.#node.appendChild(this.#stats.dom);
      this.#animationSubscription = this.animationFrameStore.register({
        obj: null,
        callback: () => {
          this.#stats.update();
        },
      });
    });
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.#animationSubscription) {
        this.#animationSubscription.unsubscribe();
      }

      if (this.#stats) {
        this.#stats.end();
        this.#node.removeChild(this.#stats.dom);
      }
    });
  }
}

@NgModule({
  declarations: [NgtStats],
  exports: [NgtStats],
})
export class NgtStatsModule {}
