import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rad' })
export class NgtRadianPipe implements PipeTransform {
  transform(value: number): number {
    return (value * Math.PI) / 180;
  }
}

@NgModule({
  declarations: [NgtRadianPipe],
  exports: [NgtRadianPipe],
})
export class NgtRadianPipeModule {}
