import { ImprovedNoise } from 'three-stdlib';

export const worldWidth = 128,
  worldDepth = 128;
export const worldHalfWidth = worldWidth / 2;
export const worldHalfDepth = worldDepth / 2;

const data = generateHeight(worldWidth, worldDepth);

function generateHeight(width: number, height: number) {
  const data = [],
    perlin = new ImprovedNoise(),
    size = width * height,
    z = Math.random() * 100;

  let quality = 2;

  for (let j = 0; j < 4; j++) {
    if (j === 0) for (let i = 0; i < size; i++) data[i] = 0;

    for (let i = 0; i < size; i++) {
      const x = i % width,
        y = (i / width) | 0;
      data[i] += perlin.noise(x / quality, y / quality, z) * quality;
    }

    quality *= 4;
  }

  return data;
}

export function getY(x: number, z: number) {
  return (data[x + z * worldWidth] * 0.15) | 0;
}

export const planeOptions = {
  pxPlane: {
    uv: [1, 3],
    rotate: ['rotateY', Math.PI / 2],
    translate: [50, 0, 0],
  },
  nxPlane: {
    uv: [1, 3],
    rotate: ['rotateY', -Math.PI / 2],
    translate: [-50, 0, 0],
  },
  pyPlane: {
    uv: [5, 7],
    rotate: ['rotateX', -Math.PI / 2],
    translate: [0, 50, 0],
  },
  pzPlane: {
    uv: [1, 3],
    rotate: ['', 0],
    translate: [0, 0, 50],
  },
  nzPlane: {
    uv: [1, 3],
    rotate: ['rotateY', Math.PI],
    translate: [0, 0, -50],
  },
} as const;
