import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'ngt-root',
  template: `
    <router-outlet *ngIf="isHome$ | async; else doc"></router-outlet>
    <ng-template #doc>
      <tui-doc-main>
        <ng-container ngProjectAs="tuiDocHeader">
          <a tuiLink class="link" href="https://github.com/nartc/angular-three">
            GitHub
          </a>
        </ng-container>
      </tui-doc-main>
    </ng-template>
  `,
  styles: [
    `
      .link {
        margin-left: 1rem;
      }
    `,
  ],
})
export class AppComponent {
  readonly isHome$ = this.router.events.pipe(
    map(() => this.router.routerState.snapshot.url === '/'),
    distinctUntilChanged()
  );

  constructor(private router: Router) {}
}
