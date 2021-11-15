import { Component } from '@angular/core';

@Component({
  selector: 'ngt-root',
  template: `
    <ngt-canvas>
      <ngt-mesh>
        <ngt-mesh-basic-material
          [parameters]="{ color: 'hotpink' }"
        ></ngt-mesh-basic-material>
        <ngt-box-geometry></ngt-box-geometry>
      </ngt-mesh>
    </ngt-canvas>
  `,
  styles: [``],
})
export class AppComponent {
  title = 'docs';
}
