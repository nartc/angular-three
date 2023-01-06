import {
  injectNgtRef,
  injectNgtStore,
  NgtPortal,
  NgtPortalContent,
  prepare,
} from '@angular-three/core';
import { Component, Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { Camera, Scene } from 'three';

@Directive({
  selector: 'ngts-hud-before-render',
  standalone: true,
})
export class NgtsHudBeforeRender implements OnInit, OnDestroy {
  readonly #portalStore = injectNgtStore();

  @Input() renderPriority = 1;
  @Input() parentScene!: Scene;
  @Input() parentCamera!: Camera;

  #subscription?: () => void;

  ngOnInit() {
    let oldClear: boolean;
    this.#subscription = this.#portalStore.get('internal').subscribe(() => {
      const { gl, scene, camera } = this.#portalStore.get();
      oldClear = gl.autoClear;
      if (this.renderPriority === 1) {
        // clear scene and render with default
        gl.autoClear = true;
        gl.render(this.parentScene, this.parentCamera);
      }
      // disable cleaning
      gl.autoClear = false;
      gl.clearDepth();
      gl.render(scene, camera);
      // restore
      gl.autoClear = oldClear;
    }, this.renderPriority);
  }

  ngOnDestroy() {
    this.#subscription?.();
  }
}

@Component({
  selector: 'ngts-hud',
  standalone: true,
  template: `
    <ngt-portal [container]="hudScene" [state]="{events: {priority: renderPriority + 1}}">
      <ng-template ngtPortalContent> 
        <ng-content>
        <ngts-hud-before-render [scene]="get('scene')" [camera]="get('camera')" [renderPriority]="renderPriority"></ngts-hud-before-render>
      </ng-template>
    </ngt-portal>
  `,
  imports: [NgtPortal, NgtPortalContent, NgtsHudBeforeRender],
})
export class NgtsHud {
  readonly #store = injectNgtStore();

  readonly get = this.#store.get('get');
  readonly hudScene = injectNgtRef<Scene>(prepare(new Scene()));

  @Input() renderPriority = 1;
}
