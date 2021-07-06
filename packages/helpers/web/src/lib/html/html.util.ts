import {
  Camera,
  Matrix4,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Raycaster,
  Vector3,
} from 'three';

/* Port from React Drei HTML component: https://github.com/pmndrs/drei/blob/master/src/web/Html.tsx */
const v1 = new Vector3();
const v2 = new Vector3();
const v3 = new Vector3();

export class HtmlUtil {
  static defaultCalculatePosition(
    el: Object3D,
    camera: Camera,
    size: { width: number; height: number }
  ): number[] {
    const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
    objectPos.project(camera);
    const widthHalf = size.width / 2;
    const heightHalf = size.height / 2;
    return [
      objectPos.x * widthHalf + widthHalf,
      -(objectPos.y * heightHalf) + heightHalf,
    ];
  }

  static isObjectBehindCamera(el: Object3D, camera: Camera): boolean {
    const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
    const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
    const deltaCamObj = objectPos.sub(cameraPos);
    const camDir = camera.getWorldDirection(v3);
    return deltaCamObj.angleTo(camDir) > Math.PI / 2;
  }

  static isObjectVisible(
    el: Object3D,
    camera: Camera,
    raycaster: Raycaster,
    occlude: Object3D[]
  ): boolean {
    const elPos = v1.setFromMatrixPosition(el.matrixWorld);
    const screenPos = elPos.clone();
    screenPos.project(camera);
    raycaster.setFromCamera(screenPos, camera);
    const intersects = raycaster.intersectObjects(occlude, true);

    if (intersects.length) {
      const intersectionDistance = intersects[0].distance;
      const pointDistance = elPos.distanceTo(raycaster.ray.origin);
      return pointDistance < intersectionDistance;
    }

    return true;
  }

  static objectScale(el: Object3D, camera: Camera): number {
    if (camera instanceof OrthographicCamera) {
      return camera.zoom;
    }

    if (camera instanceof PerspectiveCamera) {
      const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
      const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
      const vFOV = (camera.fov * Math.PI) / 180;
      const dist = objectPos.distanceTo(cameraPos);
      const scaleFOV = 2 * Math.tan(vFOV / 2) * dist;
      return 1 / scaleFOV;
    }

    return 1;
  }

  static objectZIndex(
    el: Object3D,
    camera: Camera,
    zIndexRange: Array<number>
  ): number | undefined {
    if (
      camera instanceof PerspectiveCamera ||
      camera instanceof OrthographicCamera
    ) {
      const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
      const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
      const dist = objectPos.distanceTo(cameraPos);
      const A = (zIndexRange[1] - zIndexRange[0]) / (camera.far - camera.near);
      const B = zIndexRange[1] - A * camera.far;
      return Math.round(A * dist + B);
    }
    return undefined;
  }

  static epsilon(value: number): number {
    return Math.abs(value) < 1e-10 ? 0 : value;
  }

  static getCSSMatrix(
    matrix: Matrix4,
    multipliers: number[],
    prepend = ''
  ): string {
    let matrix3d = 'matrix3d(';
    for (let i = 0; i !== 16; i++) {
      matrix3d +=
        this.epsilon(multipliers[i] * matrix.elements[i]) +
        (i !== 15 ? ',' : ')');
    }
    return prepend + matrix3d;
  }

  static getCameraCSSMatrix = ((multipliers: number[]) => {
    return (matrix: Matrix4) => HtmlUtil.getCSSMatrix(matrix, multipliers);
  })([1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1]);

  static getObjectCSSMatrix = ((scaleMultipliers: (n: number) => number[]) => {
    return (matrix: Matrix4, factor: number) =>
      HtmlUtil.getCSSMatrix(
        matrix,
        scaleMultipliers(factor),
        'translate(-50%,-50%)'
      );
  })((f: number) => [
    1 / f,
    1 / f,
    1 / f,
    1,
    -1 / f,
    -1 / f,
    -1 / f,
    -1,
    1 / f,
    1 / f,
    1 / f,
    1,
    1,
    1,
    1,
    1,
  ]);
}
