import {
  addAfterCallback,
  addCallback,
  coerceNumberProperty,
  NgtComponentStore,
  NumberInput,
  tapEffect,
} from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  NgZone,
  OnInit,
} from '@angular/core';

import Stats from 'three/examples/jsm/libs/stats.module';

@Component({
  selector: 'ngt-stats',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtStats extends NgtComponentStore implements OnInit {
  readonly #zone = inject(NgZone);
  readonly #document = inject(DOCUMENT);

  @Input() parent?: HTMLElement;
  @Input() set showPanel(showPanel: NumberInput) {
    this.#showPanel = coerceNumberProperty(showPanel);
  }

  readonly #stats = Stats();
  #node = this.#document.body;
  #showPanel = 0;

  get stats() {
    return this.#stats;
  }

  ngOnInit() {
    this.#zone.runOutsideAngular(() => {
      this.effect<void>(
        tapEffect(() => {
          if (this.parent) {
            this.#node = this.parent;
          }

          this.#stats.showPanel(this.#showPanel);
          this.#node.appendChild(this.#stats.dom);

          const beginCallbackCleanup = addCallback(() => this.#stats.begin());
          const endCallbackCleanup = addAfterCallback(() => this.#stats.end());

          return () => {
            if (this.#stats) {
              this.#node.removeChild(this.#stats.dom);
              beginCallbackCleanup();
              endCallbackCleanup();
            }
          };
        })
      )();
    });
  }
}
