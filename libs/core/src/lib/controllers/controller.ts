import {
  ChangeDetectorRef,
  Directive,
  InjectionToken,
  Input,
  OnChanges,
  Optional,
  Provider,
  SimpleChanges,
  Type,
} from '@angular/core';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { NgtDestroyed } from '../services/destroyed';

@Directive()
export abstract class Controller implements OnChanges {
  @Input() disabled = false;

  readonly changes$ = new ReplaySubject<SimpleChanges>(1);

  readyFn?: () => void;

  ngOnChanges(changes: SimpleChanges): void {
    this.changes$.next(changes);
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
