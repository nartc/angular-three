import {
    createBeforeRenderCallback,
    defaultProjector,
    make,
    NgtArgs,
    NgtCompound,
    NgtObjectCompound,
    NgtObservableInput,
    NgtRadianPipe,
    NgtRef,
    provideInstanceRef,
    skipFirstUndefined,
} from '@angular-three/core';
import { NgtOrthographicCamera } from '@angular-three/core/cameras';
import { NgtMeshBasicMaterial } from '@angular-three/core/materials';
import { NgtGroup, NgtMesh } from '@angular-three/core/objects';
import { Component, Input } from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { HorizontalBlurShader, VerticalBlurShader } from 'three-stdlib';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';

@Component({
    selector: 'ngt-soba-contact-shadows',
    standalone: true,
    template: `
        <ngt-group [objectCompound]="this" [rotation]="[90 | radian, 0, 0]" [beforeRender]="onBeforeRender">
            <ngt-mesh [geometry]="planeGeometry$" [scale]="[1, -1, 1]" [rotation]="[-90 | radian, 0, 0]">
                <ngt-mesh-basic-material
                    [map]="map$"
                    [transparent]="true"
                    [opacity]="readKey('opacity')"
                    [depthWrite]="readKey('depthWrite')"
                ></ngt-mesh-basic-material>
            </ngt-mesh>

            <ngt-orthographic-camera [ref]="readKey('shadowCameraRef')" *args="cameraArgs$"></ngt-orthographic-camera>
        </ngt-group>
    `,
    imports: [
        NgtGroup,
        NgtObjectCompound,
        NgtRadianPipe,
        NgtMesh,
        NgtMeshBasicMaterial,
        NgtOrthographicCamera,
        NgtArgs,
    ],
    providers: [provideInstanceRef(SobaContactShadows, { compound: true })],
    inputs: [...NGT_INSTANCE_INPUTS, ...NGT_OBJECT3D_INPUTS, 'color'],
    outputs: NGT_INSTANCE_OUTPUTS,
})
export class SobaContactShadows extends NgtCompound<NgtGroup> {
    @Input() set opacity(opacity: NgtObservableInput<number>) {
        this.write({ opacity });
    }

    @Input() set width(width: NgtObservableInput<number>) {
        this.write({ width });
    }

    @Input() set height(height: NgtObservableInput<number>) {
        this.write({ height });
    }

    @Input() set blur(blur: NgtObservableInput<number>) {
        this.write({ blur });
    }

    @Input() set far(far: NgtObservableInput<number>) {
        this.write({ far });
    }

    @Input() set smooth(smooth: NgtObservableInput<boolean>) {
        this.write({ smooth });
    }

    @Input() set resolution(resolution: NgtObservableInput<number>) {
        this.write({ resolution });
    }

    @Input() set frames(frames: NgtObservableInput<number>) {
        this.write({ frames });
    }

    @Input() set depthWrite(depthWrite: NgtObservableInput<boolean>) {
        this.write({ depthWrite });
    }

    private count = 1;

    readonly cameraArgs$ = this.select(
        this.select((s) => s['scaledWidth']),
        this.select((s) => s['scaledHeight']),
        this.select((s) => s['far']),
        (width, height, far) => [-width / 2, width / 2, height / 2, -height / 2, 0, far],
        { debounce: true }
    );

    readonly map$ = this.select(
        this.select((s) => s['renderTarget']).pipe(skipFirstUndefined()),
        (renderTarget) => renderTarget.texture,
        { debounce: true }
    );

    readonly planeGeometry$ = this.select((s) => s['planeGeometry'], { debounce: true }).pipe(skipFirstUndefined());

    private readonly setShadows = this.effect(
        tap(() => {
            const { resolution, scaledWidth: width, scaledHeight: height, color } = this.read();
            const gl = this.store.read((s) => s.gl);

            const renderTarget = new THREE.WebGLRenderTarget(resolution, resolution);
            renderTarget.texture.encoding = gl.outputEncoding;

            const renderTargetBlur = new THREE.WebGLRenderTarget(resolution, resolution);
            renderTargetBlur.texture.generateMipmaps = renderTarget.texture.generateMipmaps = false;

            const planeGeometry = new THREE.PlaneGeometry(width, height).rotateX(Math.PI / 2);
            const blurPlane = new THREE.Mesh(planeGeometry);
            const depthMaterial = new THREE.MeshDepthMaterial();
            depthMaterial.depthTest = depthMaterial.depthWrite = false;
            depthMaterial.onBeforeCompile = (shader) => {
                shader.uniforms = {
                    ...shader.uniforms,
                    ucolor: {
                        value: new THREE.Color(color).convertSRGBToLinear(),
                    },
                };
                shader.fragmentShader = shader.fragmentShader.replace(
                    `void main() {`, //
                    `uniform vec3 ucolor;
           void main() {
          `
                );
                shader.fragmentShader = shader.fragmentShader.replace(
                    'vec4( vec3( 1.0 - fragCoordZ ), opacity );',
                    'vec4( ucolor, ( 1.0 - fragCoordZ ) * 1.0 );'
                );
            };

            const horizontalBlurMaterial = new THREE.ShaderMaterial(HorizontalBlurShader);
            const verticalBlurMaterial = new THREE.ShaderMaterial(VerticalBlurShader);
            verticalBlurMaterial.depthTest = horizontalBlurMaterial.depthTest = false;

            this.write({
                renderTarget,
                planeGeometry,
                depthMaterial,
                blurPlane,
                horizontalBlurMaterial,
                verticalBlurMaterial,
                renderTargetBlur,
            });
        })
    );

    readonly onBeforeRender = createBeforeRenderCallback<THREE.Group>(({ object: group }) => {
        group.scale.setScalar(1);
        const { shadowCameraRef, frames, depthMaterial, renderTarget, smooth, blur } = this.read();
        const gl = this.store.read((s) => s.gl);
        const scene = this.store.read((s) => s.scene);

        if (shadowCameraRef && shadowCameraRef.value && renderTarget && (frames === Infinity || this.count < frames)) {
            const initialBackground = scene.background;
            scene.background = null;
            const initialOverrideMaterial = scene.overrideMaterial;
            scene.overrideMaterial = depthMaterial;
            gl.setRenderTarget(renderTarget);
            gl.render(scene, shadowCameraRef.value);
            scene.overrideMaterial = initialOverrideMaterial;

            this.blurShadows(blur);
            if (smooth) this.blurShadows(blur * 0.4);

            gl.setRenderTarget(null);
            scene.background = initialBackground;
            this.count++;
        }
    });

    override get useOnHost(): (keyof NgtGroup | string)[] {
        return [...super.useOnHost, 'beforeRender', 'rotation'];
    }

    override initialize() {
        super.initialize();
        this.write({
            shadowCameraRef: new NgtRef(),
            scale: 10,
            frames: Infinity,
            opacity: 1,
            width: 1,
            height: 1,
            blur: 1,
            far: 10,
            resolution: 512,
            smooth: true,
            color: make(THREE.Color, '#000000'),
            depthWrite: false,
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.write(
                this.select(
                    this.select((s) => s['width']),
                    this.select((s) => s['height']),
                    this.select((s) => s.scale),
                    (width, height, scale) => ({
                        scaledWidth: width * (Array.isArray(scale) ? scale[0] : scale || 1),
                        scaledHeight: height * (Array.isArray(scale) ? scale[1] : scale || 1),
                    })
                )
            );

            this.setShadows(
                this.select(
                    this.select((s) => s['resolution']),
                    this.select((s) => s['scaledWidth']).pipe(skipFirstUndefined()),
                    this.select((s) => s['scaledHeight']).pipe(skipFirstUndefined()),
                    this.select((s) => s.scale),
                    this.select((s) => s.color),
                    defaultProjector,
                    { debounce: true }
                )
            );
        });
    }

    private blurShadows(blur: number) {
        const {
            renderTarget,
            blurPlane,
            horizontalBlurMaterial,
            verticalBlurMaterial,
            renderTargetBlur,
            shadowCameraRef,
        } = this.read();
        const gl = this.store.read((s) => s.gl);

        blurPlane.visible = true;

        blurPlane.material = horizontalBlurMaterial;
        horizontalBlurMaterial.uniforms.tDiffuse.value = renderTarget.texture;
        horizontalBlurMaterial.uniforms.h.value = blur / 256;

        gl.setRenderTarget(renderTargetBlur);
        gl.render(blurPlane, shadowCameraRef.value);

        blurPlane.material = verticalBlurMaterial;
        verticalBlurMaterial.uniforms.tDiffuse.value = renderTargetBlur.texture;
        verticalBlurMaterial.uniforms.v.value = blur / 256;

        gl.setRenderTarget(renderTarget);
        gl.render(blurPlane, shadowCameraRef.value);

        blurPlane.visible = false;
    }
}
