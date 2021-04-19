import type { AnyConstructor } from '@angular-three/core';
import { ThreeBufferGeometry } from '@angular-three/core/geometries';
import {
  Directive,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Optional,
} from '@angular/core';
import type { BuiltinShaderAttributeName } from 'three';
import { BufferAttribute } from 'three';

@Directive()
export abstract class ThreeAttribute<
  TAttribute extends BufferAttribute = BufferAttribute
> implements OnInit, OnChanges {
  @Input() attach?: BuiltinShaderAttributeName;

  abstract attributeType: AnyConstructor<TAttribute>;

  constructor(
    protected readonly ngZone: NgZone,
    @Optional() protected readonly geometryDirective?: ThreeBufferGeometry
  ) {}

  private _extraArgs: unknown[] = [];

  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  private _attribute!: TAttribute;

  ngOnChanges() {
    this.ngZone.runOutsideAngular(() => {
      if (this.attribute) {
        this.attribute.needsUpdate = true;
      }
    });
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.geometryDirective && this.attach) {
        this._attribute = new this.attributeType(...this._extraArgs);
        this.geometryDirective.bufferGeometry.setAttribute(
          this.attach,
          this.attribute
        );
      }
    });
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.geometryDirective && this.attach) {
        this.geometryDirective.bufferGeometry.deleteAttribute(this.attach);
      }
    });
  }

  get attribute(): TAttribute {
    return this._attribute;
  }
}
