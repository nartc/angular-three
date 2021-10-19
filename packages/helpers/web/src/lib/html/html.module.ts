import { ThreeCoreModule } from '@angular-three/core';
import { ThreeGroupModule } from '@angular-three/core/group';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HtmlElementDirective } from './html-element.directive';
import { HtmlComponent } from './html.component';

@NgModule({
  declarations: [HtmlComponent, HtmlElementDirective],
  exports: [HtmlComponent, HtmlElementDirective],
  imports: [ThreeGroupModule, ThreeCoreModule, CommonModule],
})
export class HtmlModule {}
