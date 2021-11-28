export function setupCanvas({
  cameraPosition = [-5, 5, 5],
  cameraFov = 75,
  lights = true,
  controls = true,
  black = false,
}: Partial<{
  cameraPosition: [number, number, number];
  cameraFov: number;
  controls: boolean;
  lights: boolean;
  black: boolean;
}> = {}) {
  return (story: string) => `
    <ngt-canvas [camera]='{position: [${cameraPosition}], fov: ${cameraFov}}' (created)='$event.gl.setClearAlpha(${
    black ? 'black' : 'white'
  })'>
      <ngt-stats></ngt-stats>

      <ng-container *ngIf='${lights}'>
        <ngt-ambient-light [intensity]='0.8'></ngt-ambient-light>
        <ngt-point-light [intensity]='1' [position]='[0, 6, 0]'></ngt-point-light>
      </ng-container>

      <ngt-orbit-controls *ngIf='${controls}'></ngt-orbit-controls>

      ${story}
    </ngt-canvas>
  `;
}
