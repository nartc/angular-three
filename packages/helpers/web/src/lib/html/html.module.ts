import { ThreeCoreModule } from '@angular-three/core';
import { ThreeGroupModule } from '@angular-three/core/group';
import { NgModule } from '@angular/core';
import { HtmlElementDirective } from './html-element.directive';
import { HtmlComponent } from './html.component';

@NgModule({
  declarations: [HtmlComponent, HtmlElementDirective],
  exports: [HtmlComponent, HtmlElementDirective],
  imports: [ThreeGroupModule, ThreeCoreModule],
})
export class HtmlModule {}
