import { ChangeDetectionStrategy, Component } from '@angular/core';

let count = 0;

@Component({
  selector: 'demo-root',
  template: `
    <!--    <demo-jumbo-birds></demo-jumbo-birds>-->
    <!--    <demo-shaders-boxes></demo-shaders-boxes>-->
    <demo-spinning-cubes></demo-spinning-cubes>
    <!--    <demo-suzanne-instanced-mesh></demo-suzanne-instanced-mesh>-->
    <!--    <demo-level-of-details></demo-level-of-details>-->
    <!--    <demo-docs-homepage></demo-docs-homepage>-->

    <!--    {{ render() }}-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  render() {
    console.log('render count: ', ++count);
  }
}
