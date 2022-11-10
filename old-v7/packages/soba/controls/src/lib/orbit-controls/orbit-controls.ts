import {
  coerceBoolean,
  coerceNumber,
  NgtBooleanInput,
  NgtInstance,
  NgtInstanceState,
  NgtNumberInput,
  NgtPrepareInstanceFn,
  NgtVector3,
  provideInstanceRef,
  provideNgtInstance,
  tapEffect,
} from '@angular-three/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { filter } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

export interface NgtSobaOrbitControlsState extends NgtInstanceState<OrbitControls> {
  camera?: THREE.Camera;
  domElement?: HTMLElement;
  enableDamping?: boolean;
  makeDefault?: boolean;
  regress?: boolean;
  target?: NgtVector3;
}

@Component({
  selector: 'ngt-soba-orbit-controls',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtInstance(NgtSobaOrbitControls), provideInstanceRef(NgtSobaOrbitControls)],
})
export class NgtSobaOrbitControls extends NgtInstance<OrbitControls, NgtSobaOrbitControlsState> {
  @Input() set enabled(enabled: NgtBooleanInput) {
    this.set({ enabled: coerceBoolean(enabled) });
  }

  @Input() set camera(camera: THREE.Camera) {
    this.set({ camera });
  }

  @Input() set domElement(domElement: HTMLElement) {
    this.set({ domElement });
  }

  @Input() set makeDefault(makeDefault: NgtBooleanInput) {
    this.set({ makeDefault: coerceBoolean(makeDefault) });
  }

  @Input() set regress(regress: NgtBooleanInput) {
    this.set({ regress: coerceBoolean(regress) });
  }

  @Input() set target(target: NgtVector3) {
    this.set({ target });
  }

  @Input() set enableDamping(enableDamping: NgtBooleanInput) {
    this.set({ enableDamping: coerceBoolean(enableDamping) });
  }

  @Input() set minDistance(minDistance: NgtNumberInput) {
    this.set({ minDistance: coerceNumber(minDistance) });
  }

  @Input() set maxDistance(maxDistance: NgtNumberInput) {
    this.set({ maxDistance: coerceNumber(maxDistance) });
  }

  @Input() set minZoom(minZoom: NgtNumberInput) {
    this.set({ minZoom: coerceNumber(minZoom) });
  }

  @Input() set maxZoom(maxZoom: NgtNumberInput) {
    this.set({ maxZoom: coerceNumber(maxZoom) });
  }

  @Input() set minPolarAngle(minPolarAngle: NgtNumberInput) {
    this.set({ minPolarAngle: coerceNumber(minPolarAngle) });
  }

  @Input() set maxPolarAngle(maxPolarAngle: NgtNumberInput) {
    this.set({ maxPolarAngle: coerceNumber(maxPolarAngle) });
  }

  @Input() set minAzimuthAngle(minAzimuthAngle: NgtNumberInput) {
    this.set({ minAzimuthAngle: coerceNumber(minAzimuthAngle) });
  }

  @Input() set maxAzimuthAngle(maxAzimuthAngle: NgtNumberInput) {
    this.set({ maxAzimuthAngle: coerceNumber(maxAzimuthAngle) });
  }

  @Input() set dampingFactor(dampingFactor: NgtNumberInput) {
    this.set({ dampingFactor: coerceNumber(dampingFactor) });
  }

  @Input() set enableZoom(enableZoom: NgtBooleanInput) {
    this.set({ enableZoom: coerceBoolean(enableZoom) });
  }

  @Input() set zoomSpeed(zoomSpeed: NgtNumberInput) {
    this.set({ zoomSpeed: coerceNumber(zoomSpeed) });
  }

  @Input() set enableRotate(enableRotate: NgtBooleanInput) {
    this.set({ enableRotate: coerceBoolean(enableRotate) });
  }

  @Input() set rotateSpeed(rotateSpeed: NgtNumberInput) {
    this.set({ rotateSpeed: coerceNumber(rotateSpeed) });
  }

  @Input() set enablePan(enablePan: NgtBooleanInput) {
    this.set({ enablePan: coerceBoolean(enablePan) });
  }

  @Input() set panSpeed(panSpeed: NgtNumberInput) {
    this.set({ panSpeed: coerceNumber(panSpeed) });
  }

  @Input() set screenSpacePanning(screenSpacePanning: NgtBooleanInput) {
    this.set({
      screenSpacePanning: coerceBoolean(screenSpacePanning),
    });
  }

  @Input() set keyPanSpeed(keyPanSpeed: NgtNumberInput) {
    this.set({ keyPanSpeed: coerceNumber(keyPanSpeed) });
  }

  @Input() set autoRotate(autoRotate: NgtBooleanInput) {
    this.set({ autoRotate: coerceBoolean(autoRotate) });
  }

  @Input() set autoRotateSpeed(autoRotateSpeed: NgtNumberInput) {
    this.set({ autoRotateSpeed: coerceNumber(autoRotateSpeed) });
  }

  @Input() set reverseOrbit(reverseOrbit: NgtBooleanInput) {
    this.set({ reverseOrbit: coerceBoolean(reverseOrbit) });
  }

  @Input() set keys(keys: { LEFT: string; UP: string; RIGHT: string; BOTTOM: string }) {
    this.set({ keys });
  }

  @Input() set mouseButtons(mouseButtons: { LEFT: THREE.MOUSE; MIDDLE: THREE.MOUSE; RIGHT: THREE.MOUSE }) {
    this.set({ mouseButtons });
  }

  @Input() set touches(touches: { ONE: THREE.TOUCH; TWO: THREE.TOUCH }) {
    this.set({ touches });
  }

  @Output() change = new EventEmitter<THREE.Event>();
  @Output() start = new EventEmitter<THREE.Event>();
  @Output() end = new EventEmitter<THREE.Event>();

  private readonly setBeforeRender = this.effect<void>(
    tapEffect(() =>
      this.store.registerBeforeRender({
        priority: -1,
        callback: () => {
          if (this.instanceValue.enabled) {
            this.instanceValue.update();
          }
        },
      })
    )
  );

  private readonly connectDomElement = this.effect(
    tapEffect(() => {
      const domElement = this.getState((s) => s.domElement);
      if (domElement) {
        this.instanceValue.connect(domElement);
      }

      return () => {
        this.instanceValue.dispose();
      };
    })
  );

  private readonly setEvents = this.effect(
    tapEffect(() => {
      const { invalidate, performance } = this.store.getState();
      const regress = this.getState((s) => s.regress);

      const changeCallback: (e: THREE.Event) => void = (e) => {
        invalidate();
        if (regress) {
          performance.regress();
        }

        if (this.change.observed) {
          this.change.emit(e);
        }
      };
      let startCallback: (e: THREE.Event) => void;
      let endCallback: (e: THREE.Event) => void;

      this.instanceValue.addEventListener('change', changeCallback);

      if (this.start.observed) {
        startCallback = (event: THREE.Event) => {
          this.start.emit(event);
        };
        this.instanceValue.addEventListener('start', startCallback);
      }

      if (this.end.observed) {
        endCallback = (event: THREE.Event) => {
          this.end.emit(event);
        };
        this.instanceValue.addEventListener('end', endCallback);
      }

      return () => {
        this.instanceValue.removeEventListener('change', changeCallback);
        if (endCallback) this.instanceValue.removeEventListener('end', endCallback);
        if (startCallback) this.instanceValue.removeEventListener('start', startCallback);
      };
    })
  );

  private readonly setDefaultControls = this.effect(
    tapEffect(() => {
      const makeDefault = this.getState((s) => s.makeDefault);
      if (makeDefault) {
        const oldControls = this.store.getState((s) => s.controls);
        this.store.set({ controls: this.instanceValue });
        return () => {
          this.store.set({ controls: oldControls });
        };
      }
    })
  );

  override initTrigger$ = this.select((s) => s.camera).pipe(filter((camera) => !!camera));

  override initialize() {
    super.initialize();
    this.set({
      enabled: true,
      regress: false,
      enableDamping: true,
    });
  }

  override preStoreReady() {
    super.preStoreReady();
    this.set((s) => ({
      domElement:
        s.domElement ?? this.store.getState((s) => s.events.connected) ?? this.store.getState((s) => s.gl.domElement),
    }));
    if (!this.getState((s) => s.camera)) {
      this.set({
        camera: this.store.select((s) => s.camera),
      });
    }
  }

  override initFn(prepareInstance: NgtPrepareInstanceFn<OrbitControls>): (() => void) | void | undefined {
    const camera = this.getState((s) => s.camera);
    if (camera) {
      prepareInstance(new OrbitControls(camera));
    }
  }

  override postInit() {
    super.postInit();
    this.setBeforeRender();

    const instance$ = this.instanceRef.pipe(filter((instance) => instance !== null));
    this.connectDomElement(
      this.select(
        instance$,
        this.select((s) => s.domElement),
        this.select((s) => s.regress),
        this.store.select((s) => s.invalidate),
        this.defaultProjector
      )
    );
    this.setEvents(instance$);
    this.setDefaultControls(
      this.select(
        instance$,
        this.select((s) => s.makeDefault),
        this.defaultProjector
      )
    );
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'enabled',
      'target',
      'enableDamping',
      'minDistance',
      'maxDistance',
      'minZoom',
      'maxZoom',
      'minPolarAngle',
      'maxPolarAngle',
      'minAzimuthAngle',
      'maxAzimuthAngle',
      'dampingFactor',
      'enableZoom',
      'zoomSpeed',
      'enableRotate',
      'rotateSpeed',
      'enablePan',
      'panSpeed',
      'screenSpacePanning',
      'keyPanSpeed',
      'autoRotate',
      'autoRotateSpeed',
      'reverseOrbit',
      'keys',
      'mouseButtons',
      'touches',
    ];
  }
}
