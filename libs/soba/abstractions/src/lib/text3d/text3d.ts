import { Component, Input, NgModule } from '@angular/core';

import { Box3, Euler, Group, Material, Mesh, MeshBasicMaterial } from 'three';

import { NgtTriple } from '@angular-three/core';

import { Font, FontLoader, TextGeometry } from 'three-stdlib';

import { NgtGroupModule } from '@angular-three/core/group';

//
// adapted from three.js example https://threejs.org/examples/?q=text#webgl_geometry_text
//
@Component({
    selector: 'ngt-soba-text3d[fonturl]',
    template: '<ngt-group #text (ready)="ready(text.instance.value)" [position]="position" [scale]="scale" [rotation]="rotation"></ngt-group>'
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
            this.refreshtext()
        }
    }

    //
    // see https://threejs.org/docs/index.html?q=mesh#examples/en/loaders/FontLoader for more details
    //
    private _fonturl = '';
    @Input()
    get fonturl(): string {
        return this._fonturl;
    }
    set fonturl(newvalue: string) {
        if (newvalue && newvalue != this._fonturl) {
            this._fonturl = newvalue;
            const loader = new FontLoader();

            loader.load(newvalue,
                (font) => {
                    this.font = font;
                    this.refreshtext();
                },
                _ => { }, // progress
                (err) => {
                    console.error(err);
                });
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

    @Input() position = [0, 0, 0] as NgtTriple;
    @Input() rotation = new Euler();
    @Input() scale = [1, 1, 1] as NgtTriple;
    @Input() material: Material | Material[] = new MeshBasicMaterial();


    private font!: Font;
    private group!: Group;
    private lastmesh!: Mesh;

    ready(group: Group) {
        this.group = group;
    }

    private refreshtext() {
        if (!this.font) return;

        if (this.lastmesh) {
            this.group.remove(this.lastmesh);
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
            const boundingBox = textGeo.boundingBox ?? new Box3();
            centerOffset = - 0.5 * (boundingBox.max.x - boundingBox.min.x);
        }
        const mesh = new Mesh(textGeo, this.material);
        mesh.position.set(this.position[0] + centerOffset, this.position[1], this.position[2]);
        mesh.rotation.copy(this.rotation);
        mesh.scale.set(this.scale[0], this.scale[1], this.scale[2]);

        this.group.add(mesh);
        this.lastmesh = mesh;
    }
}


@NgModule({
    declarations: [NgtSobaText3d],
    exports: [NgtSobaText3d],
    imports: [NgtGroupModule],
})
export class NgtSobaText3dModule { }
