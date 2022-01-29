/**
 * From r3f https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/core/events.ts
 */

import * as THREE from 'three';
import type {
  NgtCamera,
  NgtDomEvent,
  NgtEvent,
  NgtEventHandlers,
  NgtEventsStoreState,
  NgtInstance,
  NgtIntersection,
  NgtPointerCaptureTarget,
  NgtRender,
  NgtState,
} from '../types';
import { makeId } from './make-id';

/** Release pointer captures.
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

export function removeInteractivity(
  eventsStateGetter: () => NgtEventsStoreState,
  object: THREE.Object3D
) {
  const { internal } = eventsStateGetter();
  // Removes every trace of an object from the data store
  internal.interaction = internal.interaction.filter((o) => o !== object);
  internal.initialHits = internal.initialHits.filter((o) => o !== object);
  internal.hovered.forEach((value, key) => {
    if (value.eventObject === object || value.object === object) {
      internal.hovered.delete(key);
    }
  });
  internal.capturedMap.forEach((captures, pointerId) => {
    releaseInternalPointerCapture(
      internal.capturedMap,
      object,
      captures,
      pointerId
    );
  });
}

function getRenderState(state: NgtState): NgtRender {
  const { mouse, camera, clock, renderer, scene, size, viewport } = state;
  const delta = clock.getDelta();

  return {
    size,
    mouse,
    camera: camera as NgtCamera,
    delta,
    clock,
    renderer: renderer as THREE.WebGLRenderer,
    scene: scene as THREE.Scene,
    viewport,
  };
}

export function createEvents(
  stateGetter: () => NgtState,
  eventsStateGetter: () => NgtEventsStoreState
) {
  const temp = new THREE.Vector3();

  /** Sets up defaultRaycaster */
  function prepareRay(event: NgtDomEvent) {
    const state = stateGetter();
    const { raycaster, mouse, camera, size } = state;
    // https://github.com/pmndrs/react-three-fiber/pull/782
    // Events trigger outside of canvas when moved
    if (raycaster && camera) {
      const { offsetX, offsetY } =
        raycaster?.computeOffsets?.(event, getRenderState(state)) ?? event;

      const { width, height } = size;
      mouse.set((offsetX / width) * 2 - 1, -(offsetY / height) * 2 + 1);
      raycaster.setFromCamera(mouse, camera);
    }
  }

  /** Calculates delta */
  function calculateDistance(event: NgtDomEvent) {
    const { internal } = eventsStateGetter();
    const dx = event.offsetX - internal.initialClick[0];
    const dy = event.offsetY - internal.initialClick[1];
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  }

  /** Returns true if an instance has a valid pointer-event registered, this excludes scroll, clicks etc */
  function filterPointerEvents(objects: THREE.Object3D[]) {
    return objects.filter((obj) =>
      ['move', 'over', 'enter', 'out', 'leave'].some(
        (name) =>
          (obj as unknown as NgtInstance).__ngt?.handlers?.[
            ('pointer' + name) as keyof NgtEventHandlers
          ]
      )
    );
  }

  function intersect(filter?: (objects: THREE.Object3D[]) => THREE.Object3D[]) {
    const canvasState = stateGetter();
    const { internal } = eventsStateGetter();

    const { raycaster } = canvasState;

    // Skip event handling when noEvents is set
    if (!raycaster?.enabled) return [];

    const seen = new Set<string>();
    const intersections: NgtIntersection[] = [];

    // Allow callers to eliminate event objects
    const eventsObjects = filter
      ? filter(internal.interaction)
      : internal.interaction;

    // Intersect known handler objects and filter against duplicates
    let intersects = raycaster
      .intersectObjects(eventsObjects, true)
      .filter((item) => {
        const id = makeId(item as NgtIntersection);
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

    // https://github.com/mrdoob/three.js/issues/16031
    // Allow custom userland intersect sort order
    if (raycaster.filter)
      intersects = raycaster.filter(intersects, getRenderState(canvasState));

    for (const intersect of intersects) {
      let eventObject: THREE.Object3D | null = intersect.object;
      // Bubble event up
      while (eventObject) {
        if ((eventObject as unknown as NgtInstance).__ngt?.eventCount)
          intersections.push({ ...intersect, eventObject });
        eventObject = eventObject.parent;
      }
    }
    return intersections;
  }

  /**  Creates filtered intersects and returns an array of positive hits */
  function patchIntersects(
    intersections: NgtIntersection[],
    event: NgtDomEvent
  ) {
    const { internal } = eventsStateGetter();
    // If the interaction is captured, make all capturing targets  part of the
    // intersect.
    if ('pointerId' in event && internal.capturedMap.has(event.pointerId)) {
      for (let captureData of internal.capturedMap
        .get(event.pointerId)!
        .values()) {
        intersections.push(captureData.intersection);
      }
    }
    return intersections;
  }

  function cancelPointer(hits: NgtIntersection[]) {
    const { internal } = eventsStateGetter();
    Array.from(internal.hovered.values()).forEach((hoveredObj) => {
      // When no objects were hit or the the hovered object wasn't found underneath the cursor
      // we call onPointerOut and delete the object from the hovered-elements map
      if (
        !hits.length ||
        !hits.find(
          (hit) =>
            hit.object === hoveredObj.object &&
            hit.index === hoveredObj.index &&
            hit.instanceId === hoveredObj.instanceId
        )
      ) {
        const eventObject = hoveredObj.eventObject;
        const instance = (eventObject as unknown as NgtInstance).__ngt;
        const handlers = instance?.handlers;
        internal.hovered.delete(makeId(hoveredObj));
        if (instance?.eventCount) {
          // Clear out intersects, they are outdated by now
          const data = { ...hoveredObj, intersections: hits || [] };
          handlers?.pointerout?.(data as NgtEvent<PointerEvent>);
          handlers?.pointerleave?.(data as NgtEvent<PointerEvent>);
        }
      }
    });
  }

  /**  Handles intersections by forwarding them to handlers */
  function handleIntersects(
    intersections: NgtIntersection[],
    event: NgtDomEvent,
    delta: number,
    callback: (event: NgtEvent<NgtDomEvent>) => void
  ) {
    const { raycaster, mouse, camera } = stateGetter();
    const { internal } = eventsStateGetter();
    // If anything has been found, forward it to the event listeners
    if (intersections.length && camera) {
      const unprojectedPoint = temp.set(mouse.x, mouse.y, 0).unproject(camera);

      const localState = { stopped: false };

      for (const hit of intersections) {
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
            internal.capturedMap.get(id)!.set(hit.eventObject, captureData);
          } else {
            // if the pointerId was not previously captured, we create a map
            // containing the hitObject, and the hit. hitObject is used for
            // faster access.
            internal.capturedMap.set(
              id,
              new Map([[hit.eventObject, captureData]])
            );
          }
          // Call the original event now
          (event.target as Element).setPointerCapture(id);
        };

        const releasePointerCapture = (id: number) => {
          const captures = internal.capturedMap.get(id);
          if (captures) {
            releaseInternalPointerCapture(
              internal.capturedMap,
              hit.eventObject,
              captures,
              id
            );
          }
        };

        // Add native event props
        let extractEventProps: Record<string, unknown> = {};
        // This iterates over the event's properties including the inherited ones. Native PointerEvents have most of their props as getters which are inherited, but polyfilled PointerEvents have them all as their own properties (i.e. not inherited). We can't use Object.keys() or Object.entries() as they only return "own" properties; nor Object.getPrototypeOf(event) as that *doesn't* return "own" properties, only inherited ones.
        for (let prop in event) {
          let property = event[prop as keyof NgtDomEvent];
          // Only copy over atomics, leave functions alone as these should be
          // called as event.nativeEvent.fn()
          if (typeof property !== 'function')
            extractEventProps[prop] = property;
        }

        let raycastEvent: any = {
          ...hit,
          ...extractEventProps,
          spaceX: mouse.x,
          spaceY: mouse.y,
          intersections,
          stopped: localState.stopped,
          delta,
          unprojectedPoint,
          ray: raycaster?.ray,
          camera: camera,
          // Hijack stopPropagation, which just sets a flag
          stopPropagation: () => {
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
                Array.from(internal.hovered.values()).find(
                  (i) => i.eventObject === hit.eventObject
                )
              ) {
                // Objects cannot flush out higher up objects that have already caught the event
                const higher = intersections.slice(
                  0,
                  intersections.indexOf(hit)
                );
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
          sourceEvent: event, // deprecated
          nativeEvent: event,
        };

        // Call subscribers
        callback(raycastEvent);
        // Event bubbling may be interrupted by stopPropagation
        if (localState.stopped) break;
      }
    }
    return intersections;
  }

  const handlePointer = (name: string) => {
    // Deal with cancelation
    switch (name) {
      case 'pointerleave':
      case 'pointercancel':
        return () => cancelPointer([]);
      case 'lostpointercapture':
        return (event: NgtDomEvent) => {
          const {
            internal: { capturedMap },
          } = eventsStateGetter();
          if ('pointerId' in event && !capturedMap.has(event.pointerId)) {
            // If the object event interface had onLostPointerCapture, we'd call it here on every
            // object that's getting removed.
            capturedMap.delete(event.pointerId);
            cancelPointer([]);
          }
        };
    }

    // Any other pointer goes here ...
    return (event: NgtDomEvent) => {
      const { pointerMissed, internal } = eventsStateGetter();

      prepareRay(event);

      // Get fresh intersects
      const isPointerMove = name === 'pointermove';
      const isClickEvent =
        name === 'click' || name === 'contextmenu' || name === 'dblclick';
      const filter = isPointerMove ? filterPointerEvents : undefined;
      const hits = patchIntersects(intersect(filter), event);

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
          objectPointerMissed(event, internal.interaction);
          if (pointerMissed) pointerMissed(event);
        }
      }
      // Take care of unhover
      if (isPointerMove) cancelPointer(hits);

      handleIntersects(hits, event, delta, (data: NgtEvent<NgtDomEvent>) => {
        const eventObject = data.eventObject;
        const instance = (eventObject as unknown as NgtInstance).__ngt;
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
              handlers.pointerover?.(data as NgtEvent<PointerEvent>);
              handlers.pointerenter?.(data as NgtEvent<PointerEvent>);
            } else if (hoveredItem.stopped) {
              // If the object was previously hovered and stopped, we shouldn't allow other items to proceed
              data.stopPropagation();
            }
          }
          // Call mouse move
          handlers?.pointermove?.(data as NgtEvent<PointerEvent>);
        } else {
          // All other events ...
          const handler = handlers?.[name as keyof NgtEventHandlers] as (
            event: NgtEvent<PointerEvent>
          ) => void;
          if (handler) {
            // Forward all events back to their respective handlers with the exception of click events,
            // which must use the initial target
            if (!isClickEvent || internal.initialHits.includes(eventObject)) {
              // Missed events have to come first
              objectPointerMissed(
                event,
                internal.interaction.filter(
                  (object) => !internal.initialHits.includes(object)
                )
              );
              // Now call the handler
              handler(data as NgtEvent<PointerEvent>);
            }
          }
        }
      });
    };
  };

  function objectPointerMissed(event: MouseEvent, objects: THREE.Object3D[]) {
    objects.forEach((object: THREE.Object3D) =>
      (object as unknown as NgtInstance).__ngt?.handlers?.pointermissed?.(event)
    );
  }

  return { handlePointer };
}
