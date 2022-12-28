import { extend, NgtRxStore } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

extend({});

@Component({
  selector: 'ngts-billboard',
  standalone: true,
  template: ``,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsBillboard extends NgtRxStore {
  @Input() set follow(follow: boolean) {
    this.set({ follow });
  }
  @Input() set lockX(lockX: boolean) {
    this.set({ lockX });
  }
  @Input() set lockY(lockY: boolean) {
    this.set({ lockY });
  }
  @Input() set lockZ(lockZ: boolean) {
    this.set({ lockZ });
  }

  override initialize() {
      super.initialize();
      this.set({follow: true, lockX: false, lockY: false, lockZ: false});
  }


}
