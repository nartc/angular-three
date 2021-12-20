import { NgtRender } from '@angular-three/core';
import { NgtGLTFLoaderService } from '@angular-three/soba/loaders';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Group,
  LoopOnce,
  Mesh,
} from 'three';

@Component({
  selector: 'ngt-robot',
  template: `
    <ng-container *ngIf="robot$ | async as robot">
      <ngt-primitive
        [object]="robot.scene"
        (ready)="onReady(robot.scene, robot.animations)"
        (animateReady)="onAnimateReady($event)"
      ></ngt-primitive>

      <ngt-robot-gui
        [robot]="robot.scene"
        [states]="states"
        [emotes]="emotes"
        [animationMixer]="animationMixer"
        (act)="fadeToAction($event.state, $event.duration)"
      ></ngt-robot-gui>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RobotComponent {
  robot$ = this.gltfLoaderService.load('assets/RobotExpressive.glb');

  states = [
    'Idle',
    'Walking',
    'Running',
    'Dance',
    'Death',
    'Sitting',
    'Standing',
  ];
  emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

  animationMixer?: AnimationMixer;

  #actions: Record<string, AnimationAction> = {};
  #activeAction?: AnimationAction;
  #previousAction?: AnimationAction;

  constructor(private gltfLoaderService: NgtGLTFLoaderService) {}

  onReady(model: Group, animations: AnimationClip[]) {
    this.animationMixer = new AnimationMixer(model);

    model.traverse((child) => {
      if ((child as Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      const action = this.animationMixer.clipAction(animation);
      this.#actions[animation.name] = action;

      if (
        this.emotes.indexOf(animation.name) >= 0 ||
        this.states.indexOf(animation.name) >= 4
      ) {
        action.clampWhenFinished = true;
        action.loop = LoopOnce;
      }
    }

    this.#activeAction = this.#actions['Walking'];
    this.#activeAction.play();
  }

  onAnimateReady({ delta }: NgtRender) {
    if (this.animationMixer) {
      this.animationMixer.update(delta);
    }
  }

  fadeToAction(state: string, duration: number) {
    this.#previousAction = this.#activeAction;
    this.#activeAction = this.#actions[state];

    if (this.#previousAction !== this.#activeAction) {
      this.#previousAction!.fadeOut(duration);
    }

    this.#activeAction!.reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play();
  }
}
