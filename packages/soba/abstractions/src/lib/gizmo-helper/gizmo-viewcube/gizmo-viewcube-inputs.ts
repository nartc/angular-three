import { injectInstance, NgtObservableInput, NgtStore, NgtThreeEvent } from '@angular-three/core';
import { Directive, EventEmitter, inject, Input, Output } from '@angular/core';
import { SobaGizmoHelper } from '../gizmo-helper';
import { colors, defaultFaces } from './gizmo-viewcube-constants';

@Directive()
export abstract class SobaGizmoViewcubeInputs {
    protected readonly instance = injectInstance({ host: true });
    protected readonly store = inject(NgtStore);

    @Input() set font(font: NgtObservableInput<string>) {
        this.instance.write({ font });
    }

    @Input() set opacity(opacity: NgtObservableInput<number>) {
        this.instance.write({ opacity });
    }

    @Input() set color(color: NgtObservableInput<string>) {
        this.instance.write({ color });
    }

    @Input() set hoverColor(hoverColor: NgtObservableInput<string>) {
        this.instance.write({ hoverColor });
    }

    @Input() set textColor(textColor: NgtObservableInput<string>) {
        this.instance.write({ textColor });
    }

    @Input() set strokeColor(strokeColor: NgtObservableInput<string>) {
        this.instance.write({ strokeColor });
    }

    @Input() set faces(faces: NgtObservableInput<string[]>) {
        this.instance.write({ faces });
    }

    @Output() viewcubeClick = new EventEmitter<NgtThreeEvent<MouseEvent>>();

    constructor() {
        this.instance.write({
            font: '20px Inter var, Arial, sans-serif',
            faces: defaultFaces,
            color: colors.bg,
            hoverColor: colors.hover,
            textColor: colors.text,
            strokeColor: colors.stroke,
            opacity: 1,
        });
    }

    private readonly _gizmoHelper = inject(SobaGizmoHelper, { optional: true });

    get gizmoHelper() {
        return this._gizmoHelper as SobaGizmoHelper;
    }

    get raycast() {
        return this.gizmoHelper.gizmoRaycast;
    }
}
