import { NgtRender } from '@angular-three/core';
import { NgtGLTFLoaderService } from '@angular-three/soba/loaders';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import GUI from 'lil-gui';
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
  templateUrl: './robot.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RobotComponent implements OnDestroy {
  robot$ = this.gltfLoaderService.load('assets/RobotExpressive.glb');

  #animationMixer?: AnimationMixer;
  #states = [
    'Idle',
    'Walking',
    'Running',
    'Dance',
    'Death',
    'Sitting',
    'Standing',
  ];
  #emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];
  #actions: Record<string, AnimationAction> = {};
  #activeAction?: AnimationAction;
  #previousAction?: AnimationAction;
  #gui!: GUI;
  #api: { state: string } & Record<string, (() => void) | string> = {
    state: 'Walking',
  };

  constructor(private gltfLoaderService: NgtGLTFLoaderService) {}

  onReady(model: Group, animations: AnimationClip[]) {
    this.#gui = new GUI();
    this.#animationMixer = new AnimationMixer(model);

    model.traverse((child) => {
      if ((child as Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      const action = this.#animationMixer.clipAction(animation);
      this.#actions[animation.name] = action;

      if (
        this.#emotes.indexOf(animation.name) >= 0 ||
        this.#states.indexOf(animation.name) >= 4
      ) {
        action.clampWhenFinished = true;
        action.loop = LoopOnce;
      }
    }

    const statesFolder = this.#gui.addFolder('States');
    const animationControl = statesFolder
      .add(this.#api, 'state')
      .options(this.#states);

    animationControl.onChange(() => {
      this.#fadeToAction(this.#api.state, 0.5);
    });

    statesFolder.open();

    const emotesFolder = this.#gui.addFolder('Emotes');

    const createEmoteCallback = (emote: string) => {
      this.#api[emote] = () => {
        this.#fadeToAction(emote, 0.2);
        this.#animationMixer?.addEventListener('finished', restoreState);
      };
      emotesFolder.add(this.#api, emote);
    };

    const restoreState = () => {
      this.#animationMixer?.removeEventListener('finished', restoreState);
      this.#fadeToAction(this.#api.state, 0.2);
    };

    for (let i = 0; i < this.#emotes.length; i++) {
      createEmoteCallback(this.#emotes[i]);
    }

    emotesFolder.open();

    const face = model.getObjectByName('Head_4') as Mesh;

    const expressions = Object.keys(face.morphTargetDictionary || {});
    const expressionFolder = this.#gui.addFolder('Expressions');

    for (let i = 0; i < expressions.length; i++) {
      expressionFolder
        .add(face.morphTargetInfluences!, '' + i, 0, 1, 0.01)
        .name(expressions[i]);
    }

    expressionFolder.open();

    this.#activeAction = this.#actions['Walking'];
    this.#activeAction.play();
  }

  onAnimateReady({ delta }: NgtRender) {
    if (this.#animationMixer) {
      this.#animationMixer.update(delta);
    }
  }

  ngOnDestroy() {
    this.#gui.destroy();
  }

  #fadeToAction(state: string, duration: number) {
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
