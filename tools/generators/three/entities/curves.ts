import * as THREE from 'three';
import type { EntityCollection } from '../models/entity-collection.model';

export const curves: EntityCollection = {
  core: [
    THREE.CatmullRomCurve3,
    THREE.CubicBezierCurve,
    THREE.CubicBezierCurve3,
    THREE.EllipseCurve,
    THREE.LineCurve,
    THREE.LineCurve3,
    THREE.QuadraticBezierCurve,
    THREE.QuadraticBezierCurve3,
    THREE.SplineCurve,
  ].map((m) => ({ name: m.name })),
  examples: [
    'GrannyKnot',
    'HeartCurve',
    'VivianiCurve',
    'KnotCurve',
    'HelixCurve',
    'TrefoilKnot',
    'TorusKnot',
    'CinquefoilKnot',
    'TrefoilPolynomialKnot',
    'FigureEightPolynomialKnot',
    'DecoratedTorusKnot4a',
    'DecoratedTorusKnot4b',
    'DecoratedTorusKnot5a',
    'DecoratedTorusKnot5c',
    'NURBSCurve',
  ].map((name) => ({ name })),
};
