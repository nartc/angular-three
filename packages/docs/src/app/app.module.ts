import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TUI_DOC_TITLE, TuiDocMainModule } from '@taiga-ui/addon-doc';
import { TuiLinkModule } from '@taiga-ui/core';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MarkdownModule.forRoot(),
    RouterModule.forRoot(ROUTES, { initialNavigation: 'enabledBlocking' }),
    TuiDocMainModule,
    TuiLinkModule,
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        // @ts-ignore
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          xml: () => import('highlight.js/lib/languages/xml'),
        },
      },
    },
    {
      provide: TUI_DOC_TITLE,
      useValue: 'Angular Three | ',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
