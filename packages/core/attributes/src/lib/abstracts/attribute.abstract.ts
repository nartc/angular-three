import { ThreeBufferGeometry } from '@angular-three/core/geometries';
import { Directive, Input, OnChanges, OnInit, Optional } from '@angular/core';
import type { BuiltinShaderAttributeName } from 'three';
import { BufferAttribute } from 'three';

@Directive()
export abstract class ThreeAttribute<
  TAttribute extends BufferAttribute = BufferAttribute,
  TAttributeConstructor extends typeof BufferAttribute = typeof BufferAttribute
> implements OnInit, OnChanges {
  @Input() attach?: BuiltinShaderAttributeName;

  abstract attributeType: TAttributeConstructor;

  constructor(
    @Optional() protected readonly geometryDirective?: ThreeBufferGeometry
  ) {}

  private _extraArgs: unknown[] = [];

  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
  }

  private _attribute!: TAttribute;

  ngOnChanges() {
    if (this.attribute) {
      this.attribute.needsUpdate = true;
    }
  }

  ngOnInit() {
    this._attribute = new ((this.attributeType as unknown) as new (
      ...args: unknown[]
    ) => TAttribute)(...this._extraArgs) as TAttribute;
    if (this.geometryDirective && this.attach) {
      this.geometryDirective.bufferGeometry.setAttribute(
        this.attach,
        this.attribute
      );
    }
  }

  ngOnDestroy() {
    if (this.geometryDirective && this.attach) {
      this.geometryDirective.bufferGeometry.deleteAttribute(this.attach);
    }
  }

  get attribute(): TAttribute {
    return this._attribute;
  }
}
