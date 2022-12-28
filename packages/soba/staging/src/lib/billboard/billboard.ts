import { extend, NgtRxStore } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

extend({});

@Component({
  selector: 'ngts-billboard',
  standalone: true,
  template: ``,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsBillboard extends NgtRxStore {
follow?: boolean
  lockX?: boolean
  lockY?: boolean
  lockZ?: boolean
}
