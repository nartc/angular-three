import {
  defaultProjector,
  injectNgtStore,
  injectRef,
  NgtCamera,
  NgtComponentStore,
  tapEffect,
} from '@angular-three/core-two';
import { injectNgtsFBO } from '@angular-three/soba-two/misc';
import { Directive, Input, OnInit } from '@angular/core';
import { map, tap } from 'rxjs';

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
    this.select((s) => s['resolution'], { debounce: true }).pipe(
      map((resolution) => ({ width: resolution }))
    )
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
        this.cameraRef.$,
        this.select((s) => s['manual']),
        defaultProjector,
        { debounce: true }
      )
    );
  }

  private setDefaultCamera() {
    this.effect(
      tapEffect(() => {
        const makeDefault = this.get((s) => s['makeDefault']);
        if (makeDefault) {
          const { camera: oldCamera } = this.store.get();
          this.store.set({ camera: this.cameraRef.nativeElement });
          return () => {
            this.store.set({ camera: oldCamera });
          };
        }
      })
    )(
      this.select(
        this.cameraRef.$,
        this.select((s) => s['makeDefault']),
        defaultProjector,
        { debounce: true }
      )
    );
  }
}
