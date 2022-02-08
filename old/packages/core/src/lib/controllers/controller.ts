import {
  ChangeDetectorRef,
  Directive,
  InjectionToken,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Optional,
  Provider,
  SimpleChanges,
  Type,
} from '@angular/core';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { NgtDestroyed } from '../services/destroyed';
import type { UnknownRecord } from '../types';

@Directive()
export abstract class Controller implements OnChanges, OnInit {
  @Input() disabled = false;

  protected get inputControllerProps(): [
    props: string[],
    controller: Controller | undefined
  ] {
    return [[], undefined];
  }

  readonly changes$ = new ReplaySubject<SimpleChanges>(1);

  constructor(protected zone: NgZone) {}

  readyFn?: () => void;

  ngOnChanges(changes: SimpleChanges): void {
    const [, controller] = this.inputControllerProps;
    if (controller) {
      this.assignProps();
      controller.ngOnChanges(changes);
      this.changes$.next(changes);
    } else {
      this.changes$.next(changes);
    }
  }

  ngOnInit(): void {
    const [, controller] = this.inputControllerProps;
    if (controller) {
      this.assignProps();
    }
  }

  private assignProps() {
    this.zone.runOutsideAngular(() => {
      const [props, inputController] = this.inputControllerProps;
      props.forEach((prop) => {
        const selfController = this as UnknownRecord;

        selfController[prop] =
          selfController[prop] ??
          (inputController
            ? (inputController as unknown as UnknownRecord)[prop]
            : selfController[prop]);
      });
    });
  }
}

export interface CreateControllerTokenFactoryOptions<
  TController extends Controller
> {
  watchedControllerTokenName: string;
  controller: Type<TController>;
  newInstanceOnNull?: boolean;
}

export function controllerFactory<TController extends Controller>(
  newInstanceOnNull = false,
  controllerType: Type<TController>
) {
  return (
    controller: TController | null,
    cdr: ChangeDetectorRef,
    destroyed: Observable<void>
  ): TController | null => {
    if (!controller) {
      return newInstanceOnNull ? new controllerType() : null;
    }

    controller.changes$.pipe(takeUntil(destroyed)).subscribe(() => {
      cdr.markForCheck();
    });

    return controller;
  };
}

export function createControllerProviderFactory<
  TController extends Controller
>({
  watchedControllerTokenName,
  controller,
  newInstanceOnNull = false,
}: CreateControllerTokenFactoryOptions<TController>): [
  InjectionToken<TController>,
  Provider[]
] {
  const watchedControllerToken = new InjectionToken(watchedControllerTokenName);

  const controllerProvider: Provider[] = [
    NgtDestroyed,
    {
      provide: watchedControllerToken,
      deps: [[new Optional(), controller], ChangeDetectorRef, NgtDestroyed],
      useFactory: controllerFactory(newInstanceOnNull, controller),
    },
  ];

  return [watchedControllerToken, controllerProvider];
}
