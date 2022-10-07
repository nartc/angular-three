import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sandbox-root',
  standalone: true,
  template: ` <router-outlet></router-outlet> `,
  imports: [RouterModule],
})
export class AppComponent {}
