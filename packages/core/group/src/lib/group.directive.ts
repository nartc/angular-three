import { ThreeObject3d } from '@angular-three/core';
import { Directive, OnInit } from '@angular/core';
import { Group } from 'three';

@Directive({
  selector: 'ngt-group',
  exportAs: 'ngtGroup',
  providers: [{ provide: ThreeObject3d, useExisting: GroupDirective }],
})
export class GroupDirective extends ThreeObject3d<Group> implements OnInit {
  private _group!: Group;

  ngOnInit() {
    this.init();
  }

  initObject() {
    this._group = new Group();
  }

  get object3d(): Group {
    return this._group;
  }
}
