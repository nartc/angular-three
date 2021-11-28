import * as THREE from 'three';
import type { EntityCollection } from '../models/entity-collection.model';

export const materials: EntityCollection = {
  core: [
    [THREE.ShadowMaterial.name, 'ShadowMaterialParameters'],
    [THREE.SpriteMaterial.name, 'SpriteMaterialParameters'],
    [THREE.RawShaderMaterial.name, 'ShaderMaterialParameters'],
    [THREE.ShaderMaterial.name, 'ShaderMaterialParameters'],
    [THREE.PointsMaterial.name, 'PointsMaterialParameters'],
    [THREE.MeshPhysicalMaterial.name, 'MeshPhysicalMaterialParameters'],
    [THREE.MeshStandardMaterial.name, 'MeshStandardMaterialParameters'],
    [THREE.MeshPhongMaterial.name, 'MeshPhongMaterialParameters'],
    [THREE.MeshToonMaterial.name, 'MeshToonMaterialParameters'],
    [THREE.MeshNormalMaterial.name, 'MeshNormalMaterialParameters'],
    [THREE.MeshLambertMaterial.name, 'MeshLambertMaterialParameters'],
    [THREE.MeshDepthMaterial.name, 'MeshDepthMaterialParameters'],
    [THREE.MeshDistanceMaterial.name, 'MeshDistanceMaterialParameters'],
    [THREE.MeshBasicMaterial.name, 'MeshBasicMaterialParameters'],
    [THREE.MeshMatcapMaterial.name, 'MeshMatcapMaterialParameters'],
    [THREE.LineDashedMaterial.name, 'LineDashedMaterialParameters'],
    [THREE.LineBasicMaterial.name, 'LineBasicMaterialParameters'],
  ].map(([name, parameterName]: [any, string]) => ({
    name: name,
    abstractGenerics: { main: name, secondary: parameterName },
  })),
  examples: [['LineMaterial', 'LineMaterialParameters']].map(
    ([name, parameterName]) => ({
      name,
      abstractGenerics: { main: name, secondary: parameterName },
    })
  ),
  from: {
    LineMaterial: 'lines',
    LineMaterialParameters: 'lines',
  },
};
