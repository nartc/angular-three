import { extend, injectNgtRef, NgtBeforeRender, NgtRxStore } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { LOD } from 'three';

extend({ LOD });

@Component({
  selector: 'ngts-detailed[distances]',
  standalone: true,
  template: `
    <ngt-lOD [ref]="lodRef" ngtCompound (beforeRender)="onBeforeRender($any($event))">
      <ng-content />
    </ngt-lOD>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsDetailed extends NgtRxStore implements OnInit {
  @Input() lodRef = injectNgtRef<LOD>();

  @Input() set distances(distances: number[]) {
    this.set({ distances });
  }

  ngOnInit() {
    this.#updateLodChildren();
  }

  onBeforeRender({ state, object }: NgtBeforeRender<LOD>) {
    object.update(state.camera);
  }

  #updateLodChildren() {
    this.hold(
      combineLatest([this.lodRef.children$(), this.select('distances')]),
      ([children, distances]) => {
        this.lodRef.nativeElement.levels.length = 0;
        children.forEach((child, index) => {
          this.lodRef.nativeElement.addLevel(child, distances[index]);
        });
      }
    );
  }
}
