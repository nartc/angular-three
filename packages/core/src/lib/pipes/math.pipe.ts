import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'math',
})
export class NgtMathPipe implements PipeTransform {
  transform(
    value: number | number[],
    keyOfMath: keyof Omit<
      Math,
      | 'PI'
      | 'E'
      | 'LN2'
      | 'LOG2E'
      | 'LN10'
      | 'LOG10E'
      | 'SQRT1_2'
      | 'SQRT2'
      | 'random'
    >
  ): ReturnType<Extract<Math[typeof keyOfMath], 'string'>> {
    const params: number[] = Array.isArray(value) ? value : [value];
    return (Math[keyOfMath] as unknown as (...args: number[]) => number)(
      ...params
    ) as ReturnType<Extract<Math[typeof keyOfMath], 'string'>>;
  }
}

@Pipe({
  name: 'mathConst',
})
export class NgtMathConstantPipe implements PipeTransform {
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

@NgModule({
  declarations: [NgtMathPipe, NgtMathConstantPipe],
  exports: [NgtMathPipe, NgtMathConstantPipe],
})
export class NgtMathPipeModule {}
