import { ChangeDetectionStrategy, Component } from '@angular/core';

let count = 0;

@Component({
  selector: 'demo-root',
  template: `
    <!--    <demo-jumbo-birds></demo-jumbo-birds>-->
    <!--        <demo-shaders-boxes></demo-shaders-boxes>-->
    <!--    <demo-spinning-cubes></demo-spinning-cubes>-->
    <!--        <demo-suzanne-instanced-mesh></demo-suzanne-instanced-mesh>-->
    <!--        <demo-level-of-details></demo-level-of-details>-->
    <!--    <demo-docs-homepage></demo-docs-homepage>-->

    <ul>
      <li *ngFor="let link of links">
        <a [routerLink]="link" routerLinkActive="active">{{ link }}</a>
      </li>
    </ul>
    <router-outlet></router-outlet>

    <!--    {{ render() }}-->
  `,
  styles: [
    // language=scss
    `
      ul {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        list-style-type: none;
      }

      a {
        text-decoration: none;
        color: white;
        font-size: 1rem;
        text-transform: uppercase;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
      }

      a.active {
        border: 1px solid;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  links = [
    'spinning-cubes',
    'docs-homepage',
    'jumbo-birds',
    'lod',
    'shaders-boxes',
    'suzanne',
    'html',
  ];

  render() {
    console.log('render count: ', ++count);
  }
}
