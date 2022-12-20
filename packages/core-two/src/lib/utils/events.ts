import type { RxState } from '@rx-angular/state';
import { Vector3 } from 'three';
import type {
  NgtDomEvent,
  NgtEventHandlers,
  NgtIntersection,
  NgtPointerCaptureTarget,
  NgtState,
  NgtThreeEvent,
} from '../types';
import { instanceLocalState } from './instance-local-state';
import { makeId } from './make';

/**
 * Release pointer captures.
 * This is called by releasePointerCapture in the API, and when an object is removed.
 */
function releaseInternalPointerCapture(
  capturedMap: Map<number, Map<THREE.Object3D, NgtPointerCaptureTarget>>,
  obj: THREE.Object3D,
  captures: Map<THREE.Object3D, NgtPointerCaptureTarget>,
  pointerId: number
): void {
  const captureData: NgtPointerCaptureTarget | undefined = captures.get(obj);
  if (captureData) {
    captures.delete(obj);
    // If this was the last capturing object for this pointer
    if (captures.size === 0) {
      capturedMap.delete(pointerId);
      captureData.target.releasePointerCapture(pointerId);
    }
  }
}

export function removeInteractivity(store: RxState<NgtState>, object: THREE.Object3D) {
  const { internal } = store.get();
  // Removes every trace of an object from the data store
  internal.interaction = internal.interaction.filter((o) => o !== object);
  internal.initialHits = internal.initialHits.filter((o) => o !== object);
  internal.hovered.forEach((value, key) => {
    if (value.eventObject === object || value.object === object) {
      // Clear out intersects, they are outdated by now
      internal.hovered.delete(key);
    }
  });
  internal.capturedMap.forEach((captures, pointerId) => {
    releaseInternalPointerCapture(internal.capturedMap, object, captures, pointerId);
  });
}

export function createEvents(store: RxState<NgtState>) {
  /** Calculates delta */
  function calculateDistance(event: NgtDomEvent) {
    const { internal } = store.get();
    const dx = event.offsetX - internal.initialClick[0];
    const dy = event.offsetY - internal.initialClick[1];
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  }

  /** Returns true if an instance has a valid pointer-event registered, this excludes scroll, clicks etc */
  function filterPointerEvents(objects: THREE.Object3D[]) {
    return objects.filter((obj) =>
      ['move', 'over', 'enter', 'out', 'leave'].some((name) => {
        const eventName = ('pointer' + name) as keyof NgtEventHandlers;
        return instanceLocalState(obj)?.handlers[eventName];
      })
    );
  }

  function intersect(event: NgtDomEvent, filter?: (objects: THREE.Object3D[]) => THREE.Object3D[]) {
    const state = store.get();
    const duplicates = new Set<string>();
    const intersections: NgtIntersection[] = [];
    // Allow callers to eliminate event objects
    const eventsObjects = filter ? filter(state.internal.interaction) : state.internal.interaction;
    // Reset all raycaster cameras to undefined
    for (let i = 0; i < eventsObjects.length; i++) {
      const instanceState = instanceLocalState(eventsObjects[i])?.store.get();
      if (instanceState) {
        instanceState.raycaster.camera = undefined as unknown as THREE.Camera;
      }
    }

    if (!state.previousStore) {
      // Make sure root-level pointer and ray are set up
      state.events.compute?.(event, store);
    }

    function handleRaycast(obj: THREE.Object3D<THREE.Event>) {
      const state = instanceLocalState(obj)?.store.get();
      // Skip event handling when noEvents is set, or when the raycasters camera is null
      if (!state || !state.events.enabled || state.raycaster.camera === null) return [];

      // When the camera is undefined we have to call the event layers update function
      if (state.raycaster.camera === undefined) {
        state.events.compute?.(event, store, state.previousStore);
        // If the camera is still undefined we have to skip this layer entirely
        if (state.raycaster.camera === undefined)
          state.raycaster.camera = null as unknown as THREE.Camera;
      }

      // Intersect object by object
      return state.raycaster.camera ? state.raycaster.intersectObject(obj, true) : [];
    }

    // Collect events
    let hits: THREE.Intersection<THREE.Object3D<THREE.Event>>[] = eventsObjects
      // Intersect objects
      .flatMap(handleRaycast)
      // Sort by event priority and distance
      .sort((a, b) => {
        const aState = instanceLocalState(a.object)?.store.get();
        const bState = instanceLocalState(b.object)?.store.get();
        if (!aState || !bState) return 0;
        return bState.events.priority - aState.events.priority || a.distance - b.distance;
      })
      // Filter out duplicates
      .filter((item) => {
        const id = makeId(item as NgtIntersection);
        if (duplicates.has(id)) return false;
        duplicates.add(id);
        return true;
      });

    // https://github.com/mrdoob/three.js/issues/16031
    // Allow custom userland intersect sort order, this likely only makes sense on the root filter
    if (state.events.filter) hits = state.events.filter(hits, store);

    // Bubble up the events, find the event source (eventObject)
    for (const hit of hits) {
      let eventObject: THREE.Object3D | null = hit.object;
      // Bubble event up
      while (eventObject) {
        if (instanceLocalState(eventObject)?.eventCount)
          intersections.push({ ...hit, eventObject });
        eventObject = eventObject.parent;
      }
    }

    // If the interaction is captured, make all capturing targets part of the intersect.
    if ('pointerId' in event && state.internal.capturedMap.has(event.pointerId)) {
      const captured = state.internal.capturedMap.get(event.pointerId) as Map<
        THREE.Object3D,
        NgtPointerCaptureTarget
      >;
      for (const captureData of captured.values()) {
        intersections.push(captureData.intersection);
      }
    }
    return intersections;
  }

  /**  Handles intersections by forwarding them to handlers */
  function handleIntersects(
    intersections: NgtIntersection[],
    event: NgtDomEvent,
    delta: number,
    callback: (event: NgtThreeEvent<NgtDomEvent>) => void
  ) {
    const rootState = store.get();
    // If anything has been found, forward it to the event listeners
    if (intersections.length) {
      const innerState = { stopped: false };
      for (const hit of intersections) {
        const state = instanceLocalState(hit.object)?.store.get() || rootState;
        const { raycaster, pointer, camera, internal } = state;
        const unprojectedPoint = new Vector3(pointer.x, pointer.y, 0).unproject(camera);
        const hasPointerCapture = (id: number) =>
          internal.capturedMap.get(id)?.has(hit.eventObject) ?? false;

        const setPointerCapture = (id: number) => {
          const captureData = {
            intersection: hit,
            target: event.target as Element,
          };
          if (internal.capturedMap.has(id)) {
            // if the pointerId was previously captured, we add the hit to the
            // event capturedMap.
            internal.capturedMap.get(id)?.set(hit.eventObject, captureData);
          } else {
            // if the pointerId was not previously captured, we create a map
            // containing the hitObject, and the hit. hitObject is used for
            // faster access.
            internal.capturedMap.set(id, new Map([[hit.eventObject, captureData]]));
          }
          // Call the original event now
          (event.target as Element).setPointerCapture(id);
        };

        const releasePointerCapture = (id: number) => {
          const captures = internal.capturedMap.get(id);
          if (captures) {
            releaseInternalPointerCapture(internal.capturedMap, hit.eventObject, captures, id);
          }
        };

        // Add native event props
        const extractEventProps: any = {};
        // This iterates over the event's properties including the inherited ones. Native PointerEvents have most of their props as getters which are inherited, but polyfilled PointerEvents have them all as their own properties (i.e. not inherited). We can't use Object.keys() or Object.entries() as they only return "own" properties; nor Object.getPrototypeOf(event) as that *doesn't* return "own" properties, only inherited ones.
        for (const prop in event) {
          const property = event[prop as keyof NgtDomEvent];
          // Only copy over atomics, leave functions alone as these should be
          // called as event.nativeEvent.fn()
          if (typeof property !== 'function') extractEventProps[prop] = property;
        }

        const raycastEvent: NgtThreeEvent<NgtDomEvent> = {
          ...hit,
          ...extractEventProps,
          pointer,
          intersections,
          stopped: innerState.stopped,
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
              raycastEvent.stopped = innerState.stopped = true;
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
          },
          currentTarget: {
            hasPointerCapture,
            setPointerCapture,
            releasePointerCapture,
          },
          nativeEvent: event,
        };

        // Call subscribers
        callback(raycastEvent);
        // Event bubbling may be interrupted by stopPropagation
        if (innerState.stopped === true) break;
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
        const instance = instanceLocalState(eventObject);
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
      const instance = instanceLocalState(objects[i]);
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
        const instance = instanceLocalState(eventObject);
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
