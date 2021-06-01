import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mathConst',
  pure: true,
})
export class MathConstantPipe implements PipeTransform {
  transform(
    value: number | 0,
    keyOfMathConst:
      | 'PI'
      | 'E'
      | 'LN2'
      | 'LOG2E'
      | 'LN10'
      | 'LOG10E'
      | 'SQRT1_2'
      | 'SQRT2'
      | 'random'
  ): number {
    if (keyOfMathConst === 'random') {
      return Math.random();
    }

    return value * Math[keyOfMathConst];
  }
}
