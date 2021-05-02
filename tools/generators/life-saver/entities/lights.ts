import * as THREE from 'three';

export const lights = [
  THREE.LightProbe,
  THREE.AmbientLight,
  THREE.AmbientLightProbe,
  THREE.HemisphereLight,
  THREE.HemisphereLightProbe,
  THREE.DirectionalLight,
  THREE.PointLight,
  THREE.SpotLight,
  THREE.RectAreaLight,
].map((m) => m.name);
