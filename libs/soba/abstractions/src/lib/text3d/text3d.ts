import { make, makeVector3, NgtEuler, NgtTriple, NgtVector3 } from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';
import { Font, FontLoader, TextGeometry } from 'three-stdlib';

/**
 * adapted from three.js example https://threejs.org/examples/?q=text#webgl_geometry_text
 */
@Component({
  selector: 'ngt-soba-text3d[fontUrl]',
  template: `
    <ngt-group (ready)="ready($event)" [position]="position" [scale]="scale" [rotation]="rotation"></ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaText3d {
  private _text = '';
  @Input()
  get text(): string {
    return this._text;
  }
  set text(newvalue: string) {
    if (newvalue != this._text) {
      this._text = newvalue;
      this.refreshtext();
    }
  }

  /**
   * see https://threejs.org/docs/index.html?q=mesh#examples/en/loaders/FontLoader for more details
   */
  private _fontUrl = '';
  @Input()
  get fontUrl(): string {
    return this._fontUrl;
  }
  set fontUrl(newvalue: string) {
    if (newvalue && newvalue != this._fontUrl) {
      this._fontUrl = newvalue;
      const loader = new FontLoader();

      loader.load(
        newvalue,
        (font) => {
          this.font = font;
          this.refreshtext();
        },
        (_) => {}, // progress
        (err) => {
          console.error(err);
        }
      );
    }
  }

  private _size = 2;
  @Input()
  get size(): number {
    return this._size;
  }
  set size(newvalue: number) {
    if (newvalue != this._size) {
      this._size = newvalue;
      this.refreshtext();
    }
  }

  private _height = 0.5;
  @Input()
  get height(): number {
    return this._height;
  }
  set height(newvalue: number) {
    if (newvalue != this._height) {
      this._height = newvalue;
      this.refreshtext();
    }
  }
  private _curveSegments = 2;
  @Input()
  get curveSegments(): number {
    return this._curveSegments;
  }
  set curveSegments(newvalue: number) {
    if (newvalue != this._curveSegments) {
      this._curveSegments = newvalue;
      this.refreshtext();
    }
  }

  private _bevelEnabled = false;
  @Input()
  get bevelEnabled(): boolean {
    return this._bevelEnabled;
  }
  set bevelEnabled(newvalue: boolean) {
    if (newvalue != this._bevelEnabled) {
      this._bevelEnabled = newvalue;
      this.refreshtext();
    }
  }

  private _bevelThickness = 0.1;
  @Input()
  get bevelThickness(): number {
    return this._bevelThickness;
  }
  set bevelThickness(newvalue: number) {
    if (newvalue != this._bevelThickness) {
      this._bevelThickness = newvalue;
      this.refreshtext();
    }
  }

  private _bevelSize = 0.1;
  @Input()
  get bevelSize(): number {
    return this._bevelSize;
  }
  set bevelSize(newvalue: number) {
    if (newvalue != this._bevelSize) {
      this._bevelSize = newvalue;
      this.refreshtext();
    }
  }

  private _bevelOffset = 0;
  @Input()
  get bevelOffset(): number {
    return this._bevelOffset;
  }
  set bevelOffset(newvalue: number) {
    if (newvalue != this._bevelOffset) {
      this._bevelOffset = newvalue;
      this.refreshtext();
    }
  }
  private _center = true;
  @Input()
  get center(): boolean {
    return this._center;
  }
  set center(newvalue: boolean) {
    if (newvalue != this._center) {
      this._center = newvalue;
      this.refreshtext();
    }
  }

  private _position = new THREE.Vector3();
  @Input() set position(position: NgtVector3 | undefined) {
    this._position = makeVector3(position);
  }
  get position(): THREE.Vector3 {
    return this._position;
  }

  private _rotation = new THREE.Euler();
  @Input() set rotation(rotation: NgtEuler | NgtTriple | undefined) {
    this._rotation = make(THREE.Euler, rotation);
  }
  get rotation(): THREE.Euler {
    return this._rotation;
  }

  private _scale = new THREE.Vector3(1, 1, 1);
  @Input() set scale(scale: NgtVector3 | undefined) {
    this._scale = makeVector3(scale);
  }
  get scale(): THREE.Vector3 {
    return this._scale;
  }

  @Input() material: THREE.Material | THREE.Material[] = new THREE.MeshBasicMaterial();

  private font!: Font;
  private group!: THREE.Group;
  private lastMesh!: THREE.Mesh;

  ready(group: THREE.Group) {
    this.group = group;
  }

  private refreshtext() {
    if (!this.font) return;

    if (this.lastMesh) {
      this.group.remove(this.lastMesh);
    }
    const textGeo = new TextGeometry(this.text, {
      font: this.font,
      size: this.size,
      height: this.height,
      curveSegments: this.curveSegments,
      bevelEnabled: this.bevelEnabled,
      bevelThickness: this.bevelThickness,
      bevelSize: this.bevelSize,
      bevelOffset: this.bevelOffset,
    });

    let centerOffset = 0;
    if (this.center) {
      textGeo.computeBoundingBox();
      const boundingBox = textGeo.boundingBox ?? new THREE.Box3();
      centerOffset = -0.5 * (boundingBox.max.x - boundingBox.min.x);
    }
    const mesh = new THREE.Mesh(textGeo, this.material);
    mesh.position.set(this.position.x + centerOffset, this.position.y, this.position.z);
    mesh.rotation.copy(this.rotation);
    mesh.scale.copy(this.scale);

    this.group.add(mesh);
    this.lastMesh = mesh;
  }
}

@NgModule({
  declarations: [NgtSobaText3d],
  exports: [NgtSobaText3d],
  imports: [NgtGroupModule],
})
export class NgtSobaText3dModule {}
