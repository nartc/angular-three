import { NgtCanvas } from '@angular-three/core';
import { Component } from '@angular/core';

@Component({
  selector: 'sandbox-root',
  standalone: true,
  template: `
    <ngt-canvas></ngt-canvas>
  `,
  styles: [],
  imports: [NgtCanvas],
})
export class AppComponent {
  title = 'sandbox';
}
