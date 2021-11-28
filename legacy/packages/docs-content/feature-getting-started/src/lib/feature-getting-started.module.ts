import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { generateRoutes, TuiDocPageModule } from '@taiga-ui/addon-doc';
import { MarkdownModule } from 'ngx-markdown';
import { GettingStartedPage } from './getting-started.page';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(generateRoutes(GettingStartedPage)),
    TuiDocPageModule,
    MarkdownModule,
  ],
  declarations: [GettingStartedPage],
})
export class FeatureGettingStartedModule {}
