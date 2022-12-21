import {
  defaultProjector,
  injectNgtStore,
  injectRef,
  NgtCamera,
  NgtComponentStore,
  tapEffect,
} from '@angular-three/core';
import { injectNgtsFBO } from '@angular-three/soba/misc';
import { Directive, Input, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Directive()
export abstract class NgtsCamera<TCamera extends NgtCamera>
  extends NgtComponentStore
  implements OnInit
{
  @Input() set makeDefault(makeDefault: boolean) {
    this.set({ makeDefault });
  }

  @Input() set manual(manual: boolean) {
    this.set({ manual });
  }

  @Input() set frames(frames: number) {
    this.set({ frames });
  }

  @Input() set resolution(resolution: number) {
    this.set({ resolution });
  }

  @Input() set envMap(envMap: THREE.Texture) {
    this.set({ envMap });
  }

  protected readonly store = injectNgtStore();
  readonly cameraRef = injectRef<TCamera>();
  readonly fboRef = injectNgtsFBO(() =>
    this.select((s) => s['resolution']).pipe(map((resolution) => ({ width: resolution })))
  );

  override initialize() {
    super.initialize();
    this.set({
      resolution: 256,
      frames: Infinity,
      makeDefault: false,
      manual: false,
    });
  }

  ngOnInit() {
    this.cameraRef.subscribe((camera) => {
      if (camera) {
        camera.updateProjectionMatrix();
        this.setDefaultCamera();
        this.updateProjectionMatrix();
      }
    });
  }

  private updateProjectionMatrix() {
    this.effect(
      tap(() => {
        const manual = this.get((s) => s['manual']);
        if (!manual && this.cameraRef.nativeElement) {
          this.cameraRef.nativeElement.updateProjectionMatrix();
        }
      })
    )(
      this.select(
        this.cameraRef as unknown as Observable<TCamera>,
        this.select((s) => s['manual']),
        defaultProjector
      )
    );
  }

  private setDefaultCamera() {
    this.effect(
      tapEffect(() => {
        const makeDefault = this.get((s) => s['makeDefault']);
        if (makeDefault) {
          const { camera: oldCamera } = this.store.gett();
          this.store.set({ camera: this.cameraRef.nativeElement });
          return () => {
            this.store.set({ camera: oldCamera });
          };
        }
      })
    )(
      this.select(
        this.cameraRef as unknown as Observable<TCamera>,
        this.select((s) => s['makeDefault']),
        defaultProjector
      )
    );
  }
}
