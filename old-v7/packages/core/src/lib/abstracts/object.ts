import { Directive, EventEmitter, Output } from '@angular/core';
import * as THREE from 'three';
import { NgtRef } from '../ref';
import type { NgtBeforeRender, NgtEventHandlers, NgtInstanceNode, NgtPrepareInstanceFn, NgtThreeEvent } from '../types';
import { applyProps } from '../utils/apply-props';
import { getInstanceLocalState } from '../utils/get-instance-local-state';
import { createNgtProvider } from '../utils/inject';
import { is } from '../utils/is';
import { provideNgtInstance } from './instance';
import { NgtObjectInputs, NgtObjectInputsState } from './object-inputs';

const supportedEvents = [
  'click',
  'contextmenu',
  'dblclick',
  'pointerup',
  'pointerdown',
  'pointerover',
  'pointerout',
  'pointerenter',
  'pointerleave',
  'pointermove',
  'pointermissed',
  'pointercancel',
  'wheel',
] as const;

@Directive()
export abstract class NgtObject<
  TObject extends THREE.Object3D = THREE.Object3D,
  TObjectState extends NgtObjectInputsState<TObject> = NgtObjectInputsState<TObject>
> extends NgtObjectInputs<TObject, TObjectState> {
  @Output() appended = new EventEmitter<TObject>();
  @Output() beforeRender = new EventEmitter<NgtBeforeRender<TObject>>();

  protected override initFn(prepareInstance: NgtPrepareInstanceFn<TObject>): void | (() => void) | undefined {
    if (this.instanceValue && this.__ngt__) {
      this.switch(prepareInstance);
    } else {
      prepareInstance(this.instanceInitFn(), {
        uuid: this.instanceValue?.uuid,
      });
    }

    if (this.instanceValue) {
      const observedEvents = supportedEvents.reduce(
        (result, event) => {
          const controllerEvent = this[event].observed ? this[event] : null;
          if (controllerEvent) {
            result.handlers[event] = this.eventNameToHandler(controllerEvent as EventEmitter<NgtThreeEvent<any>>);
            result.eventCount += 1;
          }
          return result;
        },
        { handlers: {}, eventCount: 0 } as {
          handlers: NgtEventHandlers;
          eventCount: number;
        }
      );

      // patch __ngt__ with events
      applyProps(this.__ngt__, observedEvents);

      // add as an interaction if there are events observed
      if (observedEvents.eventCount > 0) {
        getInstanceLocalState(this.instanceValue)?.rootGetter().addInteraction(this.instanceValue);
      }

      // append to parent
      if (is.object3d(this.instanceValue)) {
        this.appendToParent();
      }

      // setup beforeRender
      if (this.beforeRender.observed) {
        this.store.registerBeforeRender({
          obj: this.instanceRef,
          callback: (state) => {
            this.beforeRender.emit({ state, object: this.instanceValue });
          },
          priority: this.getState((s) => s.priority),
        });
      }
    }

    return () => {
      this.destroy();
    };
  }

  protected abstract instanceInitFn(): TObject;

  private switch(prepareInstance: (instance: TObject) => NgtInstanceNode<TObject>) {
    const newObject3d = this.instanceInitFn();
    if (this.instanceValue.children) {
      this.instanceValue.traverse((object) => {
        if (object !== this.instanceValue && object.parent === this.instanceValue) {
          object.parent = newObject3d;
        }
      });
      this.instanceValue.children = [];
    }

    if (this.__ngt__.eventCount > 0) {
      getInstanceLocalState(this.instanceValue)?.rootGetter().removeInteraction(this.instanceValue.uuid);
    }

    this.remove();
    prepareInstance(newObject3d);
  }

  private appendToParent(): void {
    // appendToParent is late a frame due to appendTo
    const callback = () => {
      const appendToRef = this.getState((s) => s.appendTo);
      if (appendToRef && appendToRef.value) {
        appendToRef.value.add(this.instanceValue);
        this.appended.emit(this.instanceValue);
        return;
      }

      const appendMode = this.getState((s) => s.appendMode);

      if (appendMode === 'none') return;

      if (appendMode === 'root') {
        this.addToScene();
        this.appended.emit(this.instanceValue);
        return;
      }

      if (appendMode === 'immediate') {
        this.addToParent();
        this.appended.emit(this.instanceValue);
      }
    };

    const gl = this.store.getState((s) => s.gl);
    if (gl.xr.enabled) {
      gl.xr.getSession()?.requestAnimationFrame(callback);
    } else {
      requestAnimationFrame(callback);
    }
  }

  private addToScene() {
    const scene = this.store.getState((s) => s.scene);
    if (scene) {
      scene.add(this.instanceValue);
    }
  }

  private addToParent() {
    let parent = this.parent;
    if (this.shouldUseParent(parent)) {
      parent.value.add(this.instanceValue);
      return;
    }

    parent = this.parentHostRef?.();
    if (this.shouldUseParent(parent)) {
      parent.value.add(this.instanceValue);
      return;
    }

    this.addToScene();
  }

  private remove() {
    const { appendMode, appendTo } = this.getState();
    if (appendTo && appendTo.value) {
      appendTo.value.remove(this.instanceValue);
    } else if (this.shouldUseParent(this.parent) && appendMode === 'immediate') {
      this.parent.value.remove(this.instanceValue);
    } else {
      const scene = this.store.getState((s) => s.scene);
      if (scene) {
        scene.remove(this.instanceValue);
      }
    }
  }

  private shouldUseParent(parent: NgtRef<NgtInstanceNode<THREE.Object3D>>) {
    const rootScene = this.store.rootStateGetter().scene;
    return (
      parent && parent.value && parent.value.uuid !== this.instanceValue.uuid && parent.value.uuid !== rootScene.uuid
    );
  }

  private eventNameToHandler(
    controllerEvent: EventEmitter<NgtThreeEvent<PointerEvent>> | EventEmitter<NgtThreeEvent<WheelEvent>>
  ) {
    return (event: Parameters<Exclude<NgtEventHandlers[typeof supportedEvents[number]], undefined>>[0]) => {
      // go back into Angular Zone so that state updates on these events trigger CD
      this.zone.run(() => {
        controllerEvent.emit(event as NgtThreeEvent<any>);
      });
    };
  }

  override destroy() {
    if (this.instanceValue) {
      // remove beforeRender callback
      this.store.unregisterBeforeRender(this.instanceValue.uuid);

      // remove interaction
      if (this.__ngt__.eventCount > 0) {
        getInstanceLocalState(this.instanceValue)?.rootGetter().removeInteraction(this.instanceValue.uuid);
      }

      this.remove();
    }
    super.destroy();
  }
}

export const provideNgtObject = createNgtProvider(NgtObject, provideNgtInstance);
