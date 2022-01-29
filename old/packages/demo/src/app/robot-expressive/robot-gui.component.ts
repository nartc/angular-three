import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AnimationMixer, Group, Mesh } from 'three';

@Component({
  selector: 'ngt-robot-gui',
  template: `
    <ngx-lil-gui [container]="false" [zoneless]="true">
      <ngx-lil-gui
        title="States"
        [object]="api"
        (change)="act.emit({ state: api.state, duration: 0.5 })"
      >
        <ngx-lil-gui-controller
          property="state"
          [controllerConfig]="{ collection: states }"
        ></ngx-lil-gui-controller>
      </ngx-lil-gui>

      <ngx-lil-gui title="Emotes" [object]="api">
        <ngx-lil-gui-controller
          *ngFor="let emote of emotes"
          [property]="emote"
          (preAdd)="onEmotePreAdd(emote)"
        ></ngx-lil-gui-controller>
      </ngx-lil-gui>

      <ngx-lil-gui title="Expressions" [object]="morphTargetInfluences!">
        <ngx-lil-gui-controller
          *ngFor="let pair of morphTargetDictionary! | keyvalue; index as i"
          (controllerReady)="$event.name('' + pair.key)"
          [property]="'' + i"
          [controllerConfig]="{ min: 0, max: 1, step: 0.01 }"
        ></ngx-lil-gui-controller>
      </ngx-lil-gui>
    </ngx-lil-gui>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RobotGuiComponent {
  @Input() set robot(v: Group) {
    this.morphTargetInfluences = (
      v.getObjectByName('Head_4') as Mesh
    ).morphTargetInfluences;
    this.morphTargetDictionary = (v.getObjectByName('Head_4') as Mesh)
      .morphTargetDictionary as unknown as ReadonlyMap<unknown, unknown>;
  }

  @Input() states!: string[];
  @Input() emotes!: string[];
  @Input() animationMixer?: AnimationMixer;

  @Output() act = new EventEmitter<{ state: string; duration: number }>();

  morphTargetInfluences?: number[] | undefined;
  morphTargetDictionary?: ReadonlyMap<unknown, unknown> | undefined;

  api: { state: string } & Record<string, (() => void) | string> = {
    state: 'Walking',
  };

  constructor() {}

  onEmotePreAdd(emote: string) {
    const restoreState = () => {
      this.animationMixer?.removeEventListener('finished', restoreState);
      this.act.emit({ state: this.api.state, duration: 0.2 });
    };

    this.api[emote] = () => {
      this.act.emit({ state: emote, duration: 0.2 });
      this.animationMixer?.addEventListener('finished', restoreState);
    };
  }
}
