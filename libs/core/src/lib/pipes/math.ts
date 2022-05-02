import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { is } from '../utils/is';

@Pipe({ name: 'math' })
export class NgtMathPipe implements PipeTransform {
  transform(
    value: number | number[],
    keyOfMath: keyof Omit<Math, 'PI' | 'E' | 'LN2' | 'LOG2E' | 'LN10' | 'LOG10E' | 'SQRT1_2' | 'SQRT2' | 'random'>
  ): ReturnType<Extract<Math[typeof keyOfMath], 'string'>> {
    const params: number[] = is.arr(value) ? value : [value];
    return (Math[keyOfMath] as unknown as (...args: number[]) => number)(...params) as ReturnType<
      Extract<Math[typeof keyOfMath], 'string'>
    >;
  }
}

@NgModule({
  declarations: [NgtMathPipe],
  exports: [NgtMathPipe],
})
export class NgtMathPipeModule {}
