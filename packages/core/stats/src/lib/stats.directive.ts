import { AnimationStore } from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import { Directive, Inject, OnDestroy, OnInit } from '@angular/core';
import Stats from 'three/examples/jsm/libs/stats.module';

@Directive({
  selector: 'ngt-stats',
  exportAs: 'ngtStats',
})
export class StatsDirective implements OnInit, OnDestroy {
  private stats!: Stats;

  constructor(
    private readonly animationStore: AnimationStore,
    @Inject(DOCUMENT) private readonly document: unknown
  ) {}

  ngOnInit() {
    this.stats = Stats();
    (this.document as Document).body.appendChild(this.stats.dom);
    this.animationStore.registerAnimation(() => {
      this.stats.update();
    });
  }

  ngOnDestroy() {
    this.stats.end();
  }
}
