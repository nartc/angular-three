import type {
  AnimationReady,
  ThreeEuler,
  ThreeVector3,
} from '@angular-three/core';
import { AnimationStore, LoaderService } from '@angular-three/core';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AnimationMixer, Group, Mesh } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'demo-bird',
  template: `
    <ngt-group #group="ngtGroup" (animateReady)="onGroupAnimationReady($event)">
      <ngt-scene
        *ngIf="gltf$ && gltf$ | async as gltf"
        o3d
        [name]="gltf.scene.name"
        [position]="position"
        [rotation]="rotation"
      >
        <ngt-mesh
          o3d
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
          (ready)="onBirdReady($event, gltf, group.object3d)"
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

  constructor(
    private readonly animationStore: AnimationStore,
    private readonly loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.gltf$ = this.loaderService.use(GLTFLoader, this.url);
  }

  onBirdReady(bird: Mesh, gltf: GLTF, group: Group) {
    this.mixer = new AnimationMixer(bird);
    this.mixer.clipAction(gltf.animations[0], group).play();
    this.animationStore.registerAnimation(({ delta }) => {
      this.mixer.update(delta * this.speed);
    });
  }

  onGroupAnimationReady({
    animateObject,
    renderState: { delta },
  }: AnimationReady<Group>) {
    animateObject.rotation.y +=
      Math.sin((delta * this.factor) / 2) *
      Math.cos((delta * this.factor) / 2) *
      1.5;
  }
}
