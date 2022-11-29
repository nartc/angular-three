import { NgtComponentStore, NgtObservableInput, NgtStore, NgtThreeEvent } from '@angular-three/core';
import { Directive, EventEmitter, inject, Input, Output } from '@angular/core';
import { SobaGizmoHelper } from '../gizmo-helper';
import { colors, defaultFaces } from './gizmo-viewcube-constants';

@Directive()
export abstract class SobaGizmoViewcubeInputs extends NgtComponentStore {
    protected readonly store = inject(NgtStore);

    @Input() set font(font: NgtObservableInput<string>) {
        this.write({ font });
    }

    @Input() set opacity(opacity: NgtObservableInput<number>) {
        this.write({ opacity });
    }

    @Input() set color(color: NgtObservableInput<string>) {
        this.write({ color });
    }

    @Input() set hoverColor(hoverColor: NgtObservableInput<string>) {
        this.write({ hoverColor });
    }

    @Input() set textColor(textColor: NgtObservableInput<string>) {
        this.write({ textColor });
    }

    @Input() set strokeColor(strokeColor: NgtObservableInput<string>) {
        this.write({ strokeColor });
    }

    @Input() set faces(faces: NgtObservableInput<string[]>) {
        this.write({ faces });
    }

    @Output() viewcubeClick = new EventEmitter<NgtThreeEvent<MouseEvent>>();

    override initialize() {
        super.initialize();
        this.write({
            font: '20px Inter var, Arial, sans-serif',
            faces: defaultFaces,
            color: colors.bg,
            hoverColor: colors.hover,
            textColor: colors.text,
            strokeColor: colors.stroke,
            opacity: 1,
        });
    }

    private readonly sobaGizmoHelper = inject(SobaGizmoHelper, { optional: true });

    get gizmoHelper() {
        return this.sobaGizmoHelper as SobaGizmoHelper;
    }

    get raycast() {
        return this.gizmoHelper.gizmoRaycast;
    }
}
