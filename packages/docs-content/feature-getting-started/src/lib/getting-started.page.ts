import { ChangeDetectionStrategy, Component } from '@angular/core';
import { gettingStartedMd } from './docs';

@Component({
  selector: 'docs-getting-started',
  template: `
    <tui-doc-page header="Getting Started">
      <markdown [data]="gettingStartedMd"></markdown>
    </tui-doc-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GettingStartedPage {
  gettingStartedMd = gettingStartedMd;
}
