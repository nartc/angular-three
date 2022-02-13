import { Shape } from 'cannon-es';
import * as THREE from 'three';
import { CallbackByType } from './callback-by-type';

export type WorkerCollideEvent = {
    data: {
        op: 'event';
        type: 'collide';
        target: string;
        body: string;
        contact: {
            id: string;
            ni: number[];
            ri: number[];
            rj: number[];
            impactVelocity: number;
            bi: string;
            bj: string;
            /** Contact point in world space */
            contactPoint: number[];
            /** Normal of the contact, relative to the colliding body */
            contactNormal: number[];
        };
        collisionFilters: {
            bodyFilterGroup: number;
            bodyFilterMask: number;
            targetFilterGroup: number;
            targetFilterMask: number;
        };
    };
};

export type WorkerRayhitEvent = {
    data: {
        op: 'event';
        type: 'rayhit';
        ray: {
            from: number[];
            to: number[];
            direction: number[];
            collisionFilterGroup: number;
            collisionFilterMask: number;
            uuid: string;
        };
        hasHit: boolean;
        body: string | null;
        shape: (Omit<Shape, 'body'> & { body: string }) | null;
        rayFromWorld: number[];
        rayToWorld: number[];
        hitNormalWorld: number[];
        hitPointWorld: number[];
        hitFaceIndex: number;
        distance: number;
        shouldStop: boolean;
    };
};

export type WorkerCollideBeginEvent = {
    data: {
        op: 'event';
        type: 'collideBegin';
        bodyA: string;
        bodyB: string;
    };
};

export type WorkerCollideEndEvent = {
    data: {
        op: 'event';
        type: 'collideEnd';
        bodyA: string;
        bodyB: string;
    };
};

export type WorkerContact = WorkerCollideEvent['data']['contact'];

export type CollideEvent = Omit<
    WorkerCollideEvent['data'],
    'body' | 'target' | 'contact'
> & {
    body: THREE.Object3D;
    target: THREE.Object3D;
    contact: Omit<WorkerContact, 'bi' | 'bj'> & {
        bi: THREE.Object3D;
        bj: THREE.Object3D;
    };
};
export type CollideBeginEvent = {
    op: 'event';
    type: 'collideBegin';
    target: THREE.Object3D;
    body: THREE.Object3D;
};
export type CollideEndEvent = {
    op: 'event';
    type: 'collideEnd';
    target: THREE.Object3D;
    body: THREE.Object3D;
};
export type RayhitEvent = Omit<WorkerRayhitEvent['data'], 'body'> & {
    body: THREE.Object3D | null;
};

export type CannonEvent =
    | CollideBeginEvent
    | CollideEndEvent
    | CollideEvent
    | RayhitEvent;

export type CannonEvents = {
    [uuid: string]: Partial<CallbackByType<CannonEvent>>;
};
