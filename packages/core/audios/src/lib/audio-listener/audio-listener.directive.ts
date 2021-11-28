import {
  applyProps,
  EnhancedComponentStore,
  NgtDestroyedService,
  NgtStore,
  tapEffect,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  Input,
  NgModule,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { withLatestFrom } from 'rxjs';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-audio-listener',
  exportAs: 'ngtAudioListener',
})
export class NgtAudioListener extends EnhancedComponentStore implements OnInit {
  @Input() filter?: AudioNode;
  @Input() timeDelta?: number;

  @Output() ready = new EventEmitter();

  #listener!: THREE.AudioListener;
  get listener() {
    return this.#listener;
  }

  constructor(
    private store: NgtStore,
    private destroyed: NgtDestroyedService,
    private ngZone: NgZone
  ) {
    super({});
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.#listener = new THREE.AudioListener();
      const props = {
        filter: this.filter,
        timeDelta: this.timeDelta,
      };
      applyProps(this.listener, props);
      this.#ready(this.store.selectors.ready$);
    });
  }

  #ready = this.effect<boolean>((ready$) =>
    ready$.pipe(
      withLatestFrom(this.store.selectors.camera$),
      tapEffect(([ready, camera]) => {
        this.ngZone.runOutsideAngular(() => {
          if (ready && camera) {
            camera.add(this.listener);
            this.ready.emit();
          }
        });

        return () => {
          this.ngZone.runOutsideAngular(() => {
            if (ready && camera) {
              this.listener.clear();
              camera.remove(this.listener);
            }
          });
        };
      })
    )
  );
}

@NgModule({
  declarations: [NgtAudioListener],
  exports: [NgtAudioListener],
})
export class NgtAudioListenerModule {}
