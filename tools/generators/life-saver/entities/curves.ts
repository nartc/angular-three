import * as THREE from 'three';

export const curves = [
  THREE.CatmullRomCurve3,
  THREE.CubicBezierCurve,
  THREE.CubicBezierCurve3,
  THREE.EllipseCurve,
  THREE.LineCurve,
  THREE.LineCurve3,
  THREE.QuadraticBezierCurve,
  THREE.QuadraticBezierCurve3,
  THREE.SplineCurve,
].map((m) => m.name);
