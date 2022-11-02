import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'radian', standalone: true })
export class NgtRadianPipe implements PipeTransform {
  transform(degree: number): number {
    return (degree * Math.PI) / 180;
  }
}
