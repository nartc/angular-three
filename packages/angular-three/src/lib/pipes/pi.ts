import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pi', standalone: true })
export class NgtPiPipe implements PipeTransform {
    transform(value: number): number {
        return value * Math.PI;
    }
}
