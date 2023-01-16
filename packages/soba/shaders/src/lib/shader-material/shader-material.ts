import { MathUtils, ShaderMaterial, UniformsUtils } from 'three';

export function shaderMaterial(
    uniforms: {
        [name: string]:
            | THREE.CubeTexture
            | THREE.Texture
            | Int32Array
            | Float32Array
            | THREE.Matrix4
            | THREE.Matrix3
            | THREE.Quaternion
            | THREE.Vector4
            | THREE.Vector3
            | THREE.Vector2
            | THREE.Color
            | number
            | boolean
            | Array<any>
            | null;
    },
    vertexShader: string,
    fragmentShader: string,
    onInit?: (material?: THREE.ShaderMaterial) => void
) {
    const material = class extends ShaderMaterial {
        public key = '';
        constructor(parameters = {}) {
            const entries = Object.entries(uniforms);
            // Create unforms and shaders
            super({
                uniforms: entries.reduce((acc, [name, value]) => {
                    const uniform = UniformsUtils.clone({ [name]: { value } });
                    return {
                        ...acc,
                        ...uniform,
                    };
                }, {}),
                vertexShader,
                fragmentShader,
            });
            // Create getter/setters
            entries.forEach(([name]) =>
                Object.defineProperty(this, name, {
                    get: () => this.uniforms[name].value,
                    set: (v) => (this.uniforms[name].value = v),
                })
            );

            // Assign parameters, this might include uniforms
            Object.assign(this, parameters);
            // Call onInit
            if (onInit) onInit(this);
        }
    } as unknown as typeof ShaderMaterial & { key: string };
    material.key = MathUtils.generateUUID();
    return material;
}
