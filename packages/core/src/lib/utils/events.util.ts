import type {
  CanvasStoreState,
  EventHandlers,
  EventsStoreState,
  InstanceInternal,
  InstancesStoreState,
  ThreeDomEvent,
  ThreeEvent,
  ThreeInstance,
  ThreeIntersection,
} from '@angular-three/core/typings';
import type { Object3D } from 'three';
import { Vector3 } from 'three';
import { makeId } from './make-id.util';

/**
 * From r3f https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/core/events.ts
 */
export function createEvents(
  canvasStateGetter: () => CanvasStoreState,
  eventsStateGetter: () => EventsStoreState,
  instancesStateGetter: () => InstancesStoreState
) {
  const temp = new Vector3();

  /** Sets up defaultRaycaster */
  function prepareRay(event: ThreeDomEvent) {
    const {
      raycaster,
      mouse,
      camera,
      clock,
      renderer,
      scene,
      internal: { size },
    } = canvasStateGetter();
    if (raycaster && camera && renderer && scene) {
      const { offsetX, offsetY } =
        raycaster.computeOffsets?.(event, {
          camera,
          clock,
          size,
          renderer,
          scene,
        }) ?? event;
      const { width, height } = size;
      mouse.set((offsetX / width) * 2 - 1, -(offsetY / height) * 2 + 1);
      raycaster.setFromCamera(mouse, camera);
    }
  }

  /** Calculates delta */
  function calculateDistance(event: ThreeDomEvent) {
    const {
      internal: { initialClick },
    } = eventsStateGetter();
    const dx = event.offsetX - initialClick[0];
    const dy = event.offsetY - initialClick[1];
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  }

  /** Returns true if an instance has a valid pointer-event registered, this excludes scroll, clicks etc */
  function filterPointerEvents(objects: Object3D[]) {
    return objects.filter((obj) =>
      ['move', 'over', 'enter', 'out', 'leave'].some(
        (name) =>
          ((obj as unknown) as ThreeInstance).__ngt?.handlers?.[
            ('pointer' + name) as keyof InstanceInternal['handlers']
          ]
      )
    );
  }

  function intersect(filter?: (objects: Object3D[]) => Object3D[]) {
    const { raycaster } = canvasStateGetter();
    const { objects } = instancesStateGetter();
    // Skip event handling when noEvents is set
    if (!raycaster || (raycaster && !raycaster.enabled)) return [];

    const seen = new Set<string>();
    const intersections: ThreeIntersection[] = [];

    // Allow callers to eliminate event objects
    const eventsObjects = filter
      ? filter(Object.values(objects))
      : Object.values(objects);

    // Intersect known handler objects and filter against duplicates
    let intersects = raycaster
      .intersectObjects(eventsObjects, true)
      .filter((item) => {
        const id = makeId(item as ThreeIntersection);
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

    // https://github.com/mrdoob/three.js/issues/16031
    // Allow custom userland intersect sort order
    // if (raycaster.filter) intersects = raycaster.filter(intersects, state);

    for (const intersect of intersects) {
      let eventObject: Object3D | null = intersect.object;
      // Bubble event up
      while (eventObject) {
        const handlers = ((eventObject as unknown) as ThreeInstance).__ngt
          ?.handlers;
        if (handlers) intersections.push({ ...intersect, eventObject });
        eventObject = eventObject.parent;
      }
    }
    return intersections;
  }

  /**  Creates filtered intersects and returns an array of positive hits */
  function patchIntersects(
    intersections: ThreeIntersection[],
    event: ThreeDomEvent
  ) {
    const {
      internal: { captured },
    } = eventsStateGetter();
    // If the interaction is captured take that into account, the captured event has to be part of the intersects
    if (captured && event.type !== 'click' && event.type !== 'wheel') {
      captured.forEach((captured) => {
        if (
          !intersections.find((hit) => hit.eventObject === captured.eventObject)
        )
          intersections.push(captured);
      });
    }
    return intersections;
  }

  /**  Handles intersections by forwarding them to handlers */
  function handleIntersects(
    intersections: ThreeIntersection[],
    event: ThreeDomEvent,
    callback: (event: ThreeDomEvent) => void
  ) {
    const { raycaster, mouse, camera } = canvasStateGetter();
    const { internal: eventsInternal } = eventsStateGetter();
    // If anything has been found, forward it to the event listeners
    if (intersections.length && camera) {
      const unprojectedPoint = temp.set(mouse.x, mouse.y, 0).unproject(camera);
      const delta = event.type === 'click' ? calculateDistance(event) : 0;
      const releasePointerCapture = (id: number) =>
        (event.target as Element).releasePointerCapture(id);
      const localState = { stopped: false, captured: false };

      for (const hit of intersections) {
        const setPointerCapture = (id: number) => {
          // If the hit is going to be captured flag that we're in captured state
          if (!localState.captured) {
            localState.captured = true;
            // The captured hit array is reset to collect hits
            eventsInternal.captured = [];
          }
          // Push hits to the array
          if (eventsInternal.captured) eventsInternal.captured.push(hit);
          // Call the original event now
          (event.target as Element).setPointerCapture(id);
        };

        // Add native event props
        let extractEventProps: any = {};
        for (let prop in Object.getPrototypeOf(event)) {
          // noinspection JSUnfilteredForInLoop
          extractEventProps[prop] = event[prop as keyof ThreeDomEvent];
        }

        const raycastEvent = {
          ...hit,
          ...extractEventProps,
          intersections,
          stopped: localState.stopped,
          delta,
          unprojectedPoint,
          ray: raycaster ? raycaster.ray : null,
          camera: camera,
          // Hijack stopPropagation, which just sets a flag
          stopPropagation: () => {
            // https://github.com/pmndrs/react-three-fiber/issues/596
            // Events are not allowed to stop propagation if the pointer has been captured
            const cap = eventsInternal.captured;
            if (
              !cap ||
              cap.find((h) => h.eventObject.id === hit.eventObject.id)
            ) {
              raycastEvent.stopped = localState.stopped = true;

              // Propagation is stopped, remove all other hover records
              // An event handler is only allowed to flush other handlers if it is hovered itself
              if (
                eventsInternal.hovered.size &&
                Array.from(eventsInternal.hovered.values()).find(
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
          target: { ...event.target, setPointerCapture, releasePointerCapture },
          currentTarget: {
            ...event.currentTarget,
            setPointerCapture,
            releasePointerCapture,
          },
          sourceEvent: event,
        };

        // Call subscribers
        callback(raycastEvent as ThreeDomEvent);
        // Event bubbling may be interrupted by stopPropagation
        if (localState.stopped) break;
      }
    }
    return intersections;
  }

  function cancelPointer(hits: ThreeIntersection[]) {
    const { internal } = eventsStateGetter();
    Array.from(internal.hovered.values()).forEach((hoveredObj) => {
      // When no objects were hit or the the hovered object wasn't found underneath the cursor
      // we call onPointerOut and delete the object from the hovered-elements map
      if (
        !hits.length ||
        !hits.find(
          (hit) =>
            hit.object === hoveredObj.object && hit.index === hoveredObj.index
        )
      ) {
        const eventObject = hoveredObj.eventObject;
        const handlers = ((eventObject as unknown) as ThreeInstance).__ngt
          ?.handlers;
        internal.hovered.delete(makeId(hoveredObj));
        if (handlers) {
          // Clear out intersects, they are outdated by now
          const data = { ...hoveredObj, intersections: hits || [] };
          handlers.pointerleave?.(data as ThreeEvent<PointerEvent>);
          handlers.pointerout?.(data as ThreeEvent<PointerEvent>);
        }
      }
    });
  }

  const handlePointer = (name: string) => {
    // Deal with cancelation
    switch (name) {
      case 'pointerleave':
      case 'pointercancel':
        return () => cancelPointer([]);
      case 'lostpointercapture':
        return () => {
          eventsStateGetter().internal.captured = undefined;
          cancelPointer([]);
        };
    }

    // Any other pointer goes here ...
    return (event: ThreeDomEvent) => {
      const { internal } = eventsStateGetter();
      const { objects } = instancesStateGetter();

      prepareRay(event);

      // Get fresh intersects
      const isPointerMove = name === 'pointermove';
      const filter = isPointerMove ? filterPointerEvents : undefined;
      const hits = patchIntersects(intersect(filter), event);

      // Take care of unhover
      if (isPointerMove) cancelPointer(hits);

      handleIntersects(hits, event, (data: ThreeDomEvent) => {
        const eventObject = data.eventObject;
        const handlers = ((eventObject as unknown) as ThreeInstance).__ngt
          ?.handlers;
        // Check presence of handlers
        if (!handlers) return;

        if (isPointerMove) {
          // Move event ...
          if (
            handlers.pointerover ||
            handlers.pointerenter ||
            handlers.pointerout ||
            handlers.pointerleave
          ) {
            // When enter or out is present take care of hover-state
            const id = makeId(data);
            const hoveredItem = internal.hovered.get(id);
            if (!hoveredItem) {
              // If the object wasn't previously hovered, book it and call its handler
              internal.hovered.set(id, data);
              handlers.pointerover?.(data as ThreeEvent<PointerEvent>);
              handlers.pointerenter?.(data as ThreeEvent<PointerEvent>);
            } else if (hoveredItem.stopped) {
              // If the object was previously hovered and stopped, we shouldn't allow other items to proceed
              data.stopPropagation();
            }
          }
          // Call mouse move
          handlers.pointermove?.(data as ThreeEvent<PointerEvent>);
        } else {
          // All other events ...
          const handler = handlers?.[name as keyof EventHandlers] as (
            event: ThreeEvent<PointerEvent>
          ) => void;
          if (handler) {
            // Forward all events back to their respective handlers with the exception of click events,
            // which must use the initial target
            if (
              (name !== 'click' &&
                name !== 'contextmenu' &&
                name !== 'dblclick') ||
              internal.initialHits.includes(eventObject)
            ) {
              handler(data as ThreeEvent<PointerEvent>);
              pointerMissed(
                event,
                Object.values(objects).filter(
                  (object) => object !== eventObject
                )
              );
            }
          }
        }
      });

      // Save initial coordinates on pointer-down
      if (name === 'pointerdown') {
        internal.initialClick = [event.offsetX, event.offsetY];
        internal.initialHits = hits.map((hit) => hit.eventObject);
      }

      // If a click yields no results, pass it back to the user as a miss
      if (
        (name === 'click' || name === 'contextmenu' || name === 'dblclick') &&
        !hits.length
      ) {
        if (calculateDistance(event) <= 2) {
          pointerMissed(event, Object.values(objects));
          // if (onPointerMissed) onPointerMissed();
        }
      }
    };
  };

  function pointerMissed(event: MouseEvent, objects: Object3D[]) {
    objects.forEach((object: Object3D) =>
      ((object as unknown) as ThreeInstance).__ngt?.handlers?.pointermissed?.(
        event as ThreeEvent<PointerEvent>
      )
    );
  }

  return { handlePointer };
}
