import { NgtScene } from '@angular-three/core';
import { NgIf } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@NgtScene()
@Component({
  standalone: true,
  template: `
    <mesh>
      <box-geometry></box-geometry>
    </mesh>
  `,
  imports: [NgIf],
  schemas: [NO_ERRORS_SCHEMA],
})
export default class Scene {
  flag = true;
}
