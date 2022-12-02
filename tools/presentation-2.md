# What is THREE.js?

[https://threejs.org/](https://threejs.org/)

-   Abstraction over WebGL API
    -   WebGL is extremely low-level and hard to work with.
-   Provides primitives to help developers build their Scene graph easier

```
Scene (top level Scene)
    Object3D
        Geometry (Shape)
        Material (Texture)
    Object3D
        Object3D
            Geometry (Shape)
            Material (Texture)
```

<ngt-canvas> // Top-level Canvas setups Renderer, Scene, Camera
<ngt-mesh> // scene.add
<ngt-box-geometry> // mesh.geometry = this.instance
</ngt-canvas>
