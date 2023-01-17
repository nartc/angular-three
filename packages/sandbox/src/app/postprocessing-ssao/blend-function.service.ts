import { injectNgtRef } from '@angular-three/core';
import { Injectable } from '@angular/core';
import { BlendFunction } from 'postprocessing';

@Injectable()
export class BlendFunctionService {
    readonly blendFunctionRef = injectNgtRef(BlendFunction.NORMAL);

    get blendFunctionName() {
        return this.blendFunctionRef.nativeElement === BlendFunction.NORMAL ? 'NORMAL' : 'MULTIPLY';
    }

    toggle() {
        this.blendFunctionRef.nativeElement =
            this.blendFunctionRef.nativeElement === BlendFunction.NORMAL
                ? BlendFunction.MULTIPLY
                : BlendFunction.NORMAL;
    }
}
