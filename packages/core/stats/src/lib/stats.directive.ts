import { AnimationStore } from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import { Directive, Inject, OnDestroy, OnInit } from '@angular/core';
import Stats from 'three/examples/jsm/libs/stats.module';

@Directive({
  selector: 'ngt-stats',
  exportAs: 'ngtStats',
})
export class NgtStats implements OnInit, OnDestroy {
  private stats!: Stats;

  constructor(
    private animationStore: AnimationStore,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.stats = Stats();
    this.document.body.appendChild(this.stats.dom);
    this.animationStore.registerAnimation(() => {
      this.stats.update();
    });
  }

  ngOnDestroy() {
    this.stats.end();
  }
}
