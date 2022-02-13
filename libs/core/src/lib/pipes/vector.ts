import { NgModule, Pipe, PipeTransform } from '@angular/core';
import * as THREE from 'three';
import type { NgtVector2, NgtVector3, NgtVector4 } from '../types';
import { makeVector2, makeVector3, makeVector4 } from '../utils/make';

@Pipe({ name: 'vector2' })
export class NgtVector2Pipe implements PipeTransform {
    transform(value: NgtVector2): THREE.Vector2 {
        return makeVector2(value) as THREE.Vector2;
    }
}

@Pipe({ name: 'vector3' })
export class NgtVector3Pipe implements PipeTransform {
    transform(value: NgtVector3): THREE.Vector3 {
        return makeVector3(value) as THREE.Vector3;
    }
}

@Pipe({ name: 'vector4' })
export class NgtVector4Pipe implements PipeTransform {
    transform(value: NgtVector4): THREE.Vector4 {
        return makeVector4(value) as THREE.Vector4;
    }
}

@NgModule({
    declarations: [NgtVector2Pipe, NgtVector3Pipe, NgtVector4Pipe],
    exports: [NgtVector2Pipe, NgtVector3Pipe, NgtVector4Pipe],
})
export class NgtVectorPipeModule {}
