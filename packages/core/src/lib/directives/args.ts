import { Directive, Input } from '@angular/core';
import { createInject } from '../utils/di';
import { NgtHasValidateForRenderer } from './has-validate-for-renderer';

@Directive({ selector: '[args]', standalone: true })
export class NgtArgs extends NgtHasValidateForRenderer {
  #injectedArgs: any[] = [];

  @Input() set args(args: any[] | null) {
    if (args == null || !Array.isArray(args)) return;
    if (args.length === 1 && args[0] === null) return;
    this.injected = false;
    this.#injectedArgs = args;
    this.createView();
  }

  get args() {
    if (!this.injected && this.#injectedArgs.length) {
      this.injected = true;
      return this.#injectedArgs;
    }
    return null;
  }

  validate() {
    return !this.injected && !!this.#injectedArgs.length;
  }
}

export const injectNgtArgs = createInject(NgtArgs);
