import { AnimationStore } from '@angular-three/core';
import { GroupDirective } from '@angular-three/core/group';
import type { ThreeEuler, ThreeVector3 } from '@angular-three/core/typings';
import { loadGLTF } from '@angular-three/loaders/gltf-loader';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AnimationMixer, Mesh } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'demo-bird',
  template: `
    <ngt-group>
      <ngt-scene
        *ngIf="gltf$ && gltf$ | async as gltf"
        [name]="gltf.scene.name"
        [position]="position"
        [rotation]="rotation"
      >
        <ngt-mesh
          [name]="gltf.scene.children[0].name"
          [morphTargetDictionary]="
            $any(gltf.scene.children[0]).morphTargetDictionary
          "
          [morphTargetInfluences]="
            $any(gltf.scene.children[0]).morphTargetInfluences
          "
          [rotation]="[1.5707964611537577, 0, 0]"
          [geometry]="$any(gltf.scene.children[0]).geometry"
          [material]="$any(gltf.scene.children[0]).material"
          (ready)="onBirdReady($event, gltf)"
        ></ngt-mesh>
      </ngt-scene>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirdComponent implements OnInit {
  @Input() position!: ThreeVector3;
  @Input() rotation!: ThreeEuler;
  @Input() url = '';
  @Input() speed = 1;
  @Input() factor = 0.01;

  gltf$!: Observable<GLTF>;

  mixer!: AnimationMixer;

  @ViewChild(GroupDirective) groupDirective!: GroupDirective;

  constructor(private readonly animationStore: AnimationStore) {}

  ngOnInit(): void {
    this.gltf$ = loadGLTF(this.url);
  }

  ngAfterViewInit() {
    this.animationStore.registerAnimation(
      this.groupDirective.object3d,
      (group, { delta }) => {
        group.rotation.y +=
          Math.sin((delta * this.factor) / 2) *
          Math.cos((delta * this.factor) / 2) *
          1.5;
      }
    );
  }

  onBirdReady(bird: Mesh, gltf: GLTF) {
    this.mixer = new AnimationMixer(bird);
    this.mixer
      .clipAction(gltf.animations[0], this.groupDirective.object3d)
      .play();
    this.animationStore.registerAnimation(({ delta }) => {
      this.mixer.update(delta * this.speed);
    });
  }
}
