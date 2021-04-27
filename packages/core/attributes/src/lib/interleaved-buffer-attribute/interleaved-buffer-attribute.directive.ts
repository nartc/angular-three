import { ThreeBufferGeometry } from '@angular-three/core';
import {
  Directive,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { BuiltinShaderAttributeName, InterleavedBufferAttribute } from 'three';

@Directive({
  selector: 'ngt-interleaved-buffer-attribute',
  exportAs: 'ngtInterleavedBufferAttribute',
})
export class InterleavedBufferAttributeDirective
  implements OnChanges, OnInit, OnDestroy {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof InterleavedBufferAttribute>
    | undefined;

  @Input() args!: ConstructorParameters<typeof InterleavedBufferAttribute>;
  @Input() attach?: BuiltinShaderAttributeName;

  private _attribute?: InterleavedBufferAttribute;

  constructor(
    protected readonly ngZone: NgZone,
    @Optional() protected readonly geometryDirective?: ThreeBufferGeometry
  ) {}

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
        this._attribute = new InterleavedBufferAttribute(...this.args);
        if (this.attribute) {
          this.geometryDirective.bufferGeometry.setAttribute(
            this.attach,
            this.attribute
          );
        }
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

  get attribute(): InterleavedBufferAttribute | undefined {
    return this._attribute;
  }
}
