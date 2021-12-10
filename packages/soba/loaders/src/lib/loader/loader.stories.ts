import { NgtLoaderService } from '@angular-three/core';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import { CommonModule } from '@angular/common';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
} from '@storybook/angular';
import { NgtGLTFLoaderService } from '../gltf-loader/gltf-loader.service';
import { NgtSobaLoader } from './loader.component';

export default {
  title: 'Soba/Loaders/Loader',
  component: NgtSobaLoader,
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ cameraPosition: [0, 0, 5], black: true, loader: true })
    ),
    moduleMetadata({
      imports: [...setupCanvasModules, NgtPrimitiveModule, CommonModule],
    }),
  ],
} as Meta;

const gltfLoaderService = new NgtGLTFLoaderService(new NgtLoaderService());

export const Default = () => ({
  props: {
    head$: gltfLoaderService.load(
      'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf'
    ),
  },
  template: `
    <ng-container *ngIf='head$ | async as head'>
      <ngt-primitive
        [object]="head.nodes['node_damagedHelmet_-6514']"
      ></ngt-primitive>
    </ng-container>
  `,
});
