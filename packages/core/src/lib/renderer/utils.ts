import { ChangeDetectorRef } from '@angular/core';
import { supportedEvents } from '../events';
import { NgtAttachFunction, NgtEventHandlers, NgtInstanceNode } from '../types';
import { attach, detach } from '../utils/attach';
import { removeInteractivity } from '../utils/events';
import { getLocalState, invalidateInstance } from '../utils/instance';
import { is } from '../utils/is';

export const SPECIAL_DOM_TAG = {
  NGT_PORTAL: 'ngt-portal',
  NGT_PRIMITIVE: 'ngt-primitve',
} as const;

export const ATTRIBUTES = {
  COMPOUND: 'ngtCompound',
  RENDER_PRIORITY: 'priority',
  ATTACH: 'attach',
} as const;

export function attachThreeInstances(parent: NgtInstanceNode, child: NgtInstanceNode) {
  const pLS = getLocalState(parent);
  const cLS = getLocalState(child);

  if (!pLS || !cLS) {
    throw new Error(`[NGT] THREE instances need to be prepared with local state.`);
  }

  // whether the child is added to the parent with parent.add()
  let added = false;

  if (cLS.attach) {
    const attachProp = cLS.attach;

    if (typeof attachProp === 'function') {
      const attachCleanUp = (attachProp as NgtAttachFunction)(parent, child, null as any);
      if (attachCleanUp) cLS.previousAttach = attachCleanUp;
    } else {
      // we skip attach explicitly
      if (attachProp[0] === 'none') {
        cLS.isThree = true;
        invalidateInstance(child);
        return;
      }

      // handle material array
      if (
        attachProp[0] === 'material' &&
        attachProp[1] &&
        typeof Number(attachProp[1]) === 'number' &&
        is.material(child) &&
        !Array.isArray(parent['material'])
      ) {
        parent['material'] = [];
      }

      // attach
      attach(parent, child, attachProp);

      // save value
      cLS.previousAttach = attachProp.reduce((value, property) => value[property], parent);
    }
  } else if (is.object3D(parent) && is.object3D(child)) {
    parent.add(child);
    added = true;
  }

  // This is for anything that used attach, and for non-Object3Ds that don't get attached to props;
  // that is, anything that's a child in React but not a child in the scenegraph.
  if (added) {
    pLS.addObject(child);
  } else {
    pLS.addNonObject(child);
  }

  pLS.isThree = cLS.isThree = true;
  cLS.parent = parent;

  invalidateInstance(child);
  invalidateInstance(parent);
}

export function removeThreeChild(
  parent: NgtInstanceNode,
  child: NgtInstanceNode,
  dispose?: boolean
) {
  const pLS = getLocalState(parent);
  const cLS = getLocalState(child);

  // clear parent ref
  if (cLS) cLS.parent = null;

  // remove child from parents' objects
  if (pLS?.objects) {
    pLS.removeObject(child);
  }

  if (pLS?.nonObjects) {
    pLS.removeNonObject(child);
  }

  // remove attachment
  if (cLS?.attach) {
    detach(parent, child, cLS.attach);
  } else if (is.object3D(parent) && is.object3D(child)) {
    parent.remove(child);

    // remove interactivity
    if (cLS?.store) {
      removeInteractivity(cLS.store, child);
    }
  }

  const isPrimitive = cLS?.primitive;
  if (!isPrimitive) {
    removeThreeRecursive(cLS?.objects.value || [], child, !!dispose);
    removeThreeRecursive(child.children, child, !!dispose);
  }

  // dispose
  if (child['dispose'] && !is.scene(child)) {
    queueMicrotask(() => child['dispose']());
  }

  invalidateInstance(parent);
}

function removeThreeRecursive(array: NgtInstanceNode[], parent: NgtInstanceNode, dispose: boolean) {
  if (array) [...array].forEach((child) => removeThreeChild(parent, child, dispose));
}

export function processThreeEvent(
  instance: NgtInstanceNode,
  eventName: string,
  callback: (event: any) => void,
  cdr: ChangeDetectorRef
) {
  const lS = getLocalState(instance);
  if (lS) {
    if (eventName === 'beforeRender') {
      // beforeRender is a special event
      return lS.store
        .get('internal')
        .subscribe((state) => callback({ state, object: instance }), lS.priority || 0, lS.store);
    }

    // try to get the previous handler. wrapper might have one, the THREE object might also have one with the same name
    const previousHandler = lS.handlers[eventName as keyof typeof lS.handlers];
    // readjust the callback
    const updatedCallback: typeof callback = (event) => {
      if (previousHandler) previousHandler(event);
      callback(event);
    };

    if (!lS.handlers) {
      lS.handlers = {};
    }

    lS.handlers = {
      ...lS.handlers,
      [eventName]: eventToHandler(updatedCallback, cdr),
    };

    //    // if we have eventCount, which means we already setup handlers
    //    if (localState.eventCount) {
    //      // process the event with ChangeDetectorRef
    //      localState.handlers[eventName as keyof typeof localState.handlers] = eventToHandler(
    //        updatedCallback,
    //        cdr
    //      );
    //    } else {
    //      // no eventCount, first time setting up handlers
    //      localState.handlers = {
    //        [eventName]: eventToHandler(updatedCallback, cdr),
    //      };
    //    }
    // increment the count everytime
    lS.eventCount += 1;
    // but only add the instance (target) to the interaction array (so that it is handled by the EventManager with Raycast)
    // the first time eventCount is incremented
    if (lS.eventCount === 1 && instance['raycast']) {
      lS.store.get('addInteraction')(instance);
    }

    // clean up the event listener by removing the target from the interaction array
    return () => {
      const localState = getLocalState(instance);
      if (localState && localState.eventCount) {
        localState.store.get('removeInteraction')(instance['uuid']);
      }
    };
  }

  return () => {};
}

export function eventToHandler(callback: (event: any) => void, cdr: ChangeDetectorRef) {
  return (
    event: Parameters<Exclude<NgtEventHandlers[typeof supportedEvents[number]], undefined>>[0]
  ) => {
    callback(event);
    cdr?.detectChanges();
  };
}

export function kebabToPascal(str: string): string {
  // split the string at each hyphen
  const parts = str.split('-');

  // map over the parts, capitalizing the first letter of each part
  const pascalParts = parts.map((part) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  });

  // join the parts together to create the final PascalCase string
  return pascalParts.join('');
}
