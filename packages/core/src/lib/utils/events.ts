import { Event, Intersection, Object3D, Vector3 } from 'three';
import { NgtRxStore } from '../stores/rx-store';
import type {
  NgtAnyRecord,
  NgtDomEvent,
  NgtEventHandlers,
  NgtIntersection,
  NgtPointerCaptureTarget,
  NgtState,
  NgtThreeEvent,
} from '../types';
import { getLocalState } from './instance';
import { makeId } from './make';

function releaseInternalPointerCapture(
  capturedMap: Map<number, Map<Object3D, NgtPointerCaptureTarget>>,
  obj: Object3D,
  captures: Map<Object3D, NgtPointerCaptureTarget>,
  pointerId: number
): void {
  const captureData: NgtPointerCaptureTarget | undefined = captures.get(obj);
  if (captureData) {
    captures.delete(obj);
    // if this was the last captured object for this pointer
    if (captures.size === 0) {
      capturedMap.delete(pointerId);
      captureData.target.releasePointerCapture(pointerId);
    }
  }
}

export function removeInteractivity(store: NgtRxStore<NgtState>, object: Object3D): void {
  const internal = store.get('internal');
  // removes every trace of an object from data store
  internal.interaction = internal.interaction.filter((o) => o !== object);
  internal.initialHits = internal.initialHits.filter((o) => o !== object);
  internal.hovered.forEach((value, key) => {
    if (value.eventObject === object || value.object === object) {
      // clear out intersects, they are outdated by now
      internal.hovered.delete(key);
    }
  });
  internal.capturedMap.forEach((captures, pointerId) => {
    releaseInternalPointerCapture(internal.capturedMap, object, captures, pointerId);
  });
}

export function createEvents(store: NgtRxStore<NgtState>) {
  /** calculates delta **/
  function calculateDistance(event: NgtDomEvent) {
    const internal = store.get('internal');
    const dx = event.offsetX - internal.initialClick[0];
    const dy = event.offsetY - internal.initialClick[1];
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  }

  /** returns true if an instance has a valid pointer-event registered, this excludes scroll, clicks etc... **/
  function filterPointerEvents(objects: Object3D[]) {
    return objects.filter((obj) => {
      ['move', 'over', 'enter', 'out', 'leave'].some((name) => {
        const eventName = `pointer${name}` as keyof NgtEventHandlers;
        return !!getLocalState(obj).handlers?.[eventName];
      });
    });
  }

  function intersect(event: NgtDomEvent, filter?: (objects: Object3D[]) => Object3D[]) {
    const state = store.get();
    const duplicates = new Set<string>();
    const intersections: NgtIntersection[] = [];
    // allow callers to eliminate event objects
    const eventObjects = filter ? filter(state.internal.interaction) : state.internal.interaction;
    // reset all raycaster cameras to undefined
    for (let i = 0; i < eventObjects.length; i++) {
      const instanceState = getLocalState(eventObjects[i]).store?.get();
      if (instanceState) {
        instanceState.raycaster.camera = undefined!;
      }
    }

    if (!state.previousStore) {
      // make sure root-level pointer and ray are setup
      state.events.compute?.(event, store);
    }

    function handleRaycast(obj: Object3D<Event>) {
      const objLocalState = getLocalState(obj);
      const objStore = objLocalState.store;
      const objState = objStore?.get();
      // skip event handling when noEvents is set, or when raycaster camera is null
      if (!objState || !objState.events.enabled || objState.raycaster.camera === null) return [];
      // when the camera is undefined, we have to call the events layers to update function
      if (objState.raycaster.camera === undefined) {
        objState.events.compute?.(event, objStore, objState.previousStore);
        // if the camera is still undefined, we have to skip this layer entirely
        if (objState.raycaster.camera === undefined) objState.raycaster.camera = null!;
      }

      // intersect object by object
      return objState.raycaster.camera ? objState.raycaster.intersectObject(obj, true) : [];
    }

    // collect events
    let hits: Intersection<Object3D<Event>>[] = eventObjects
      // intersect objects
      .flatMap(handleRaycast)
      // sort by event priority
      .sort((a, b) => {
        const aState = getLocalState(a.object).store.get();
        const bState = getLocalState(b.object).store.get();
        if (!aState || !bState) return a.distance - b.distance;
        return bState.events.priority - aState.events.priority || a.distance - b.distance;
      })
      // filter out duplicates
      .filter((item) => {
        const id = makeId(item as NgtIntersection);
        if (duplicates.has(id)) return false;
        duplicates.add(id);
        return true;
      });

    // allow custom userland intersect sort order, this likely only makes sense on the root
    if (state.events.filter) hits = state.events.filter(hits, store);

    // bubble up the events, find the event source
    for (const hit of hits) {
      let eventObject: Object3D | null = hit.object;
      // bubble event up
      while (eventObject) {
        if (getLocalState(eventObject).eventCount) {
          intersections.push({ ...hit, eventObject });
        }
        eventObject = eventObject.parent;
      }
    }

    // if the interaction is captured, make all capturing targets part of the intersects
    if ('pointerId' in event && state.internal.capturedMap.has(event.pointerId)) {
      for (const capturedData of state.internal.capturedMap.get(event.pointerId)!.values()) {
        if (!duplicates.has(makeId(capturedData.intersection))) {
          intersections.push(capturedData.intersection);
        }
      }
    }
    return intersections;
  }

  /** handle intersections by forwarding them to handlers */
  function handleIntersects(
    intersections: NgtIntersection[],
    event: NgtDomEvent,
    delta: number,
    callback: (event: NgtThreeEvent<NgtDomEvent>) => void
  ) {
    const rootState = store.get();
    // if anything has been found, forward it to the event listeners
    if (intersections.length) {
      const localState = { stopped: false };
      for (const hit of intersections) {
        const state = getLocalState(hit.object).store?.get() || rootState;
        const { raycaster, pointer, camera, internal } = state;
        const unprojectedPoint = new Vector3(pointer.x, pointer.y, 0).unproject(camera);
        const hasPointerCapture = (id: number) =>
          internal.capturedMap.get(id)?.has(hit.eventObject) ?? false;

        const setPointerCapture = (id: number) => {
          const captureData = { intersection: hit, target: event.target as Element };
          if (internal.capturedMap.has(id)) {
            // if the pointerId was previously captured, we add the hit to the event capturedMap
            internal.capturedMap.get(id)!.set(hit.eventObject, captureData);
          } else {
            // if the pointerId was not previously captured, we create a Map containing the hitObject, and the hit. hitObject is used for faster access
            internal.capturedMap.set(id, new Map([[hit.eventObject, captureData]]));
          }
          // call the original event now
          (event.target as Element).setPointerCapture(id);
        };

        const releasePointerCapture = (id: number) => {
          const captures = internal.capturedMap.get(id);
          if (captures) {
            releaseInternalPointerCapture(internal.capturedMap, hit.eventObject, captures, id);
          }
        };

        // add native event props
        const extractEventProps: NgtAnyRecord = {};
        // This iterates over the event's properties including the inherited ones. Native PointerEvents have most of their props as getters which are inherited, but polyfilled PointerEvents have them all as their own properties (i.e. not inherited). We can't use Object.keys() or Object.entries() as they only return "own" properties; nor Object.getPrototypeOf(event) as that *doesn't* return "own" properties, only inherited ones.
        for (const prop in event) {
          const property = event[prop as keyof NgtDomEvent];
          // only copy over atomics, leave functions alone as these should be called as event.nativeEvent.fn()
          if (typeof property !== 'function') {
            extractEventProps[prop] = property;
          }
        }

        const raycastEvent: NgtThreeEvent<NgtDomEvent> = {
          ...hit,
          ...extractEventProps,
          pointer,
          intersections,
          stopped: localState.stopped,
          delta,
          unprojectedPoint,
          ray: raycaster.ray,
          camera: camera,
          // Hijack stopPropagation, which just sets a flag
          stopPropagation() {
            // https://github.com/pmndrs/react-three-fiber/issues/596
            // Events are not allowed to stop propagation if the pointer has been captured
            const capturesForPointer =
              'pointerId' in event && internal.capturedMap.get(event.pointerId);

            // We only authorize stopPropagation...
            if (
              // ...if this pointer hasn't been captured
              !capturesForPointer ||
              // ... or if the hit object is capturing the pointer
              capturesForPointer.has(hit.eventObject)
            ) {
              raycastEvent.stopped = localState.stopped = true;
              // Propagation is stopped, remove all other hover records
              // An event handler is only allowed to flush other handlers if it is hovered itself
              if (
                internal.hovered.size &&
                Array.from(internal.hovered.values()).find((i) => i.eventObject === hit.eventObject)
              ) {
                // Objects cannot flush out higher up objects that have already caught the event
                const higher = intersections.slice(0, intersections.indexOf(hit));
                cancelPointer([...higher, hit]);
              }
            }
          },
          // there should be a distinction between target and currentTarget
          target: {
            hasPointerCapture,
            setPointerCapture,
            releasePointerCapture,
          } as unknown as EventTarget,
          currentTarget: {
            hasPointerCapture,
            setPointerCapture,
            releasePointerCapture,
          } as unknown as EventTarget,
          nativeEvent: event,
        } as NgtThreeEvent<NgtDomEvent>;

        // call subscribers
        callback(raycastEvent);
        // event bubbling may be interupted by stopPropagation
        if (localState.stopped === true) break;
      }
    }
    return intersections;
  }

  function cancelPointer(intersections: NgtIntersection[]) {
    const { internal } = store.get();
    for (const hoveredObj of internal.hovered.values()) {
      // When no objects were hit or the hovered object wasn't found underneath the cursor
      // we call onPointerOut and delete the object from the hovered-elements map
      if (
        !intersections.length ||
        !intersections.find(
          (hit) =>
            hit.object === hoveredObj.object &&
            hit.index === hoveredObj.index &&
            hit.instanceId === hoveredObj.instanceId
        )
      ) {
        const eventObject = hoveredObj.eventObject;
        const instance = getLocalState(eventObject);
        const handlers = instance?.handlers;
        internal.hovered.delete(makeId(hoveredObj));
        if (instance?.eventCount) {
          // Clear out intersects, they are outdated by now
          const data = { ...hoveredObj, intersections };
          handlers?.pointerout?.(data as NgtThreeEvent<PointerEvent>);
          handlers?.pointerleave?.(data as NgtThreeEvent<PointerEvent>);
        }
      }
    }
  }

  function pointerMissed(event: MouseEvent, objects: THREE.Object3D[]) {
    for (let i = 0; i < objects.length; i++) {
      const instance = getLocalState(objects[i]);
      instance?.handlers.pointermissed?.(event);
    }
  }

  function handlePointer(name: string) {
    // Deal with cancelation
    switch (name) {
      case 'pointerleave':
      case 'pointercancel':
        return () => cancelPointer([]);
      case 'lostpointercapture':
        return (event: NgtDomEvent) => {
          const { internal } = store.get();
          if ('pointerId' in event && !internal.capturedMap.has(event.pointerId)) {
            // If the object event interface had onLostPointerCapture, we'd call it here on every
            // object that's getting removed.
            internal.capturedMap.delete(event.pointerId);
            cancelPointer([]);
          }
        };
    }

    // Any other pointer goes here ...
    return function handleEvent(event: NgtDomEvent) {
      const { onPointerMissed, internal } = store.get();

      // prepareRay(event)
      internal.lastEvent = event;

      // Get fresh intersects
      const isPointerMove = name === 'pointermove';
      const isClickEvent = name === 'click' || name === 'contextmenu' || name === 'dblclick';
      const filter = isPointerMove ? filterPointerEvents : undefined;
      // const hits = patchIntersects(intersect(filter), event)
      const hits = intersect(event, filter);
      const delta = isClickEvent ? calculateDistance(event) : 0;

      // Save initial coordinates on pointer-down
      if (name === 'pointerdown') {
        internal.initialClick = [event.offsetX, event.offsetY];
        internal.initialHits = hits.map((hit) => hit.eventObject);
      }

      // If a click yields no results, pass it back to the user as a miss
      // Missed events have to come first in order to establish user-land side-effect clean up
      if (isClickEvent && !hits.length) {
        if (delta <= 2) {
          pointerMissed(event, internal.interaction);
          if (onPointerMissed) onPointerMissed(event);
        }
      }
      // Take care of unhover
      if (isPointerMove) cancelPointer(hits);

      function onIntersect(data: NgtThreeEvent<NgtDomEvent>) {
        const eventObject = data.eventObject;
        const instance = getLocalState(eventObject);
        const handlers = instance?.handlers;
        // Check presence of handlers
        if (!instance?.eventCount) return;

        if (isPointerMove) {
          // Move event ...
          if (
            handlers?.pointerover ||
            handlers?.pointerenter ||
            handlers?.pointerout ||
            handlers?.pointerleave
          ) {
            // When enter or out is present take care of hover-state
            const id = makeId(data);
            const hoveredItem = internal.hovered.get(id);
            if (!hoveredItem) {
              // If the object wasn't previously hovered, book it and call its handler
              internal.hovered.set(id, data);
              handlers.pointerover?.(data as NgtThreeEvent<PointerEvent>);
              handlers.pointerenter?.(data as NgtThreeEvent<PointerEvent>);
            } else if (hoveredItem.stopped) {
              // If the object was previously hovered and stopped, we shouldn't allow other items to proceed
              data.stopPropagation();
            }
          }
          // Call mouse move
          handlers?.pointermove?.(data as NgtThreeEvent<PointerEvent>);
        } else {
          // All other events ...
          const handler = handlers?.[name as keyof NgtEventHandlers] as (
            event: NgtThreeEvent<PointerEvent>
          ) => void;
          if (handler) {
            // Forward all events back to their respective handlers with the exception of click events,
            // which must use the initial target
            if (!isClickEvent || internal.initialHits.includes(eventObject)) {
              // Missed events have to come first
              pointerMissed(
                event,
                internal.interaction.filter((object) => !internal.initialHits.includes(object))
              );
              // Now call the handler
              handler(data as NgtThreeEvent<PointerEvent>);
            }
          } else {
            // Trigger onPointerMissed on all elements that have pointer over/out handlers, but not click and weren't hit
            if (isClickEvent && internal.initialHits.includes(eventObject)) {
              pointerMissed(
                event,
                internal.interaction.filter((object) => !internal.initialHits.includes(object))
              );
            }
          }
        }
      }

      handleIntersects(hits, event, delta, onIntersect);
    };
  }

  return { handlePointer };
}
