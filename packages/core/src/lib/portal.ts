import { Component } from '@angular/core';
import { provideNgtStore } from './store';

@Component({
  selector: 'ngt-portal',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtStore()],
})
export class NgtPortal {
  // TODO: implement Portal
}
