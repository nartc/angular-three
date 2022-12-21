import { supportedEvents } from '../events';
import type { NgtAttachFunction, NgtEventHandlers, NgtInstanceNode } from '../types';
import { attach, detach } from '../utils/attach';
import { removeInteractivity } from '../utils/events';
import { invalidateInstance } from '../utils/instance';
import { instanceLocalState } from '../utils/instance-local-state';
import { is } from '../utils/is';
import { NgtRendererStateCollection } from './renderer-state-collection';
import { NgtRendererState } from './state';

export function attachThreeInstances(
  parent: NgtInstanceNode,
  child: NgtInstanceNode,
  parentState: NgtRendererState,
  childState: NgtRendererState,
  rendererStateCollection: NgtRendererStateCollection
) {
  const parentLocalState = instanceLocalState(parent);
  const childLocalState = instanceLocalState(child);

  if (!parentLocalState || !childLocalState) {
    throw new Error(`[NGT] THREE instances need to be prepared with local state.`);
  }

  // whether the child is added to the parent with parent.add()
  let added = false;

  const newChildStore = rendererStateCollection.getStore(childState);
  if (newChildStore && (!childLocalState!.store || childLocalState!.store !== newChildStore)) {
    childLocalState.store = newChildStore;
  }

  const parentStore = rendererStateCollection.getStore(parentState);
  if (parentStore && (!parentLocalState.store || parentLocalState.store !== parentStore)) {
    parentLocalState.store = parentStore;
  }

  if (childLocalState.attach) {
    const attachProp = childLocalState.attach;

    if (typeof attachProp === 'function') {
      const attachCleanUp = (attachProp as NgtAttachFunction)(parent, child, null as any);
      if (attachCleanUp) childLocalState.previousAttach = attachCleanUp;
    } else {
      // we skip attach explicitly
      if (attachProp[0] === 'none') {
        childLocalState.isThree = true;
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
      childLocalState.previousAttach = attachProp.reduce(
        (value, property) => value[property],
        parent
      );
    }
  } else if (is.object3d(parent) && is.object3d(child)) {
    parent.add(child);
    added = true;
  }

  // This is for anything that used attach, and for non-Object3Ds that don't get attached to props;
  // that is, anything that's a child in React but not a child in the scenegraph.
  if (added) {
    parentLocalState.addObject(child);
  } else {
    parentLocalState.addNonObject(child);
  }

  parentLocalState.isThree = true;

  childLocalState.parent = childState.parent = parent;
  childLocalState.isThree = true;

  invalidateInstance(child);
  invalidateInstance(parent);
}

export function removeThreeChild(
  parent: NgtInstanceNode,
  child: NgtInstanceNode,
  rendererStateCollection: NgtRendererStateCollection,
  dispose?: boolean
) {
  const parentLocalState = instanceLocalState(parent);
  const childLocalState = instanceLocalState(child);

  // clear parent ref
  if (childLocalState) childLocalState.parent = null;

  // remove child from parents' objects
  if (parentLocalState?.objects) {
    parentLocalState.removeObject(child);
  }

  if (parentLocalState?.nonObjects) {
    parentLocalState.removeNonObject(child);
  }

  // remove attachment
  if (childLocalState?.attach) {
    detach(parent, child, childLocalState.attach);
  } else if (is.object3d(parent) && is.object3d(child)) {
    parent.remove(child);

    // remove interactivity
    if (childLocalState?.store) {
      removeInteractivity(childLocalState.store, child);
    }
  }

  const isPrimitive = childLocalState?.primitive;
  if (!isPrimitive) {
    removeThreeRecursive(
      childLocalState?.objects.value || [],
      child,
      rendererStateCollection,
      !!dispose
    );
    removeThreeRecursive(child.children, child, rendererStateCollection, !!dispose);
  }

  // remove renderer references
  rendererStateCollection.removeState(child);

  // dispose
  if (child['dispose'] && !is.scene(child)) {
    queueMicrotask(() => child['dispose']());
  }

  invalidateInstance(parent);
}

function removeThreeRecursive(
  array: NgtInstanceNode[],
  parent: NgtInstanceNode,
  rendererStateCollection: NgtRendererStateCollection,
  dispose: boolean
) {
  if (array)
    [...array].forEach((child) =>
      removeThreeChild(parent, child, rendererStateCollection, dispose)
    );
}

export function eventToHandler(
  callback: (event: any) => void,
  dom: HTMLElement,
  rendererStateCollection: NgtRendererStateCollection
) {
  const cdr = rendererStateCollection.tryGetCdrFromDom(dom);
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
