import { extend, NgtArgs, NgtCanvas, NgtPerformance } from '@angular-three/core';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { NgComponentOutlet, NgIf } from '@angular/common';
import {
  Component,
  ComponentRef,
  createEnvironmentInjector,
  CUSTOM_ELEMENTS_SCHEMA,
  EnvironmentInjector,
  inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { AmbientLight, Color, PointLight } from 'three';

interface CanvasOptions {
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
  performance?: Partial<Omit<NgtPerformance, 'regress'>>;
  whiteBackground?: boolean;
  controls?:
    | boolean
    | {
        makeDefault?: boolean;
      };
  lights?: boolean;
}

const defaultCanvasOptions: CanvasOptions = {
  camera: {
    position: [-5, 5, 5],
    fov: 75,
  },
  performance: {
    current: 1,
    min: 0.5,
    max: 1,
    debounce: 200,
  },
  whiteBackground: false,
  controls: true,
  lights: true,
};

const CANVAS_OPTIONS = new InjectionToken<CanvasOptions>('canvas options');
const STORY_COMPONENT = new InjectionToken<TemplateRef<unknown>>('story component');

extend({
  Color,
  AmbientLight,
  PointLight,
});

@Component({
  selector: 'storybook-scene',
  standalone: true,
  template: `
    <ng-container *ngIf="canvasOptions.whiteBackground">
      <ngt-color *args="['white']" attach="background"></ngt-color>
    </ng-container>

    <ng-container *ngIf="canvasOptions.lights">
      <ngt-ambient-light intensity="0.8"></ngt-ambient-light>
      <ngt-point-light intensity="1" [position]="[0, 6, 0]"></ngt-point-light>
    </ng-container>

    <ng-container *ngIf="canvasOptions.controls">
      <ngts-orbit-controls
        [makeDefault]="canvasOptions.controls?.makeDefault"
      ></ngts-orbit-controls>
    </ng-container>

    <ng-container *ngComponentOutlet="storyComponent"></ng-container>
  `,
  imports: [NgIf, NgtArgs, NgtsOrbitControls, NgComponentOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StorybookScene {
  readonly canvasOptions = inject(CANVAS_OPTIONS);
  readonly storyComponent = inject(STORY_COMPONENT);
}

@Component({
  selector: 'storybook-canvas',
  standalone: true,
  template: `
    <ngt-canvas
      [shadows]="true"
      [performance]="canvasOptions.performance"
      [camera]="canvasOptions.camera"
      [scene]="Scene"
    ></ngt-canvas>
  `,
  imports: [NgtCanvas],
})
export class StorybookCanvas {
  readonly canvasOptions = inject(CANVAS_OPTIONS);
  readonly Scene = StorybookScene;
}

@Component({
  selector: 'storybook-setup[storyComponent]',
  standalone: true,
  template: ` <ng-container #anchor></ng-container> `,
  imports: [StorybookCanvas],
})
export class StorybookSetup implements OnInit, OnDestroy {
  @Input() camera: CanvasOptions['camera'] = defaultCanvasOptions.camera;
  @Input() performance: CanvasOptions['performance'] = defaultCanvasOptions.performance;
  @Input() whiteBackground: CanvasOptions['whiteBackground'] = defaultCanvasOptions.whiteBackground;
  @Input() lights: CanvasOptions['lights'] = defaultCanvasOptions.lights;
  @Input() controls: CanvasOptions['controls'] = defaultCanvasOptions.controls;
  @Input() storyComponent!: Type<unknown>;

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  anchor!: ViewContainerRef;

  private ref?: ComponentRef<unknown>;
  readonly StorybookCanvas = StorybookCanvas;
  readonly envInjector = inject(EnvironmentInjector);

  ngOnInit() {
    const mergedOptions = {
      ...defaultCanvasOptions,
      camera: { ...defaultCanvasOptions.camera, ...this.camera },
      performance: { ...defaultCanvasOptions.performance, ...this.performance },
      whiteBackground: this.whiteBackground,
      controls: this.controls,
      lights: this.lights,
    } as Required<CanvasOptions>;
    this.ref = this.anchor.createComponent(this.StorybookCanvas, {
      environmentInjector: createEnvironmentInjector(
        [
          { provide: CANVAS_OPTIONS, useValue: mergedOptions },
          { provide: STORY_COMPONENT, useValue: this.storyComponent },
        ],
        this.envInjector
      ),
    });
    this.ref.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.ref?.destroy();
  }
}
