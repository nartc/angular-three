import { DebugNode, ElementRef } from '@angular/core';
import type { NgtInstanceNode } from '../types';

export class NgtRendererState {
  threeType?: 'normal' | 'scene' | 'portal' | 'wrapper';
  nodeType: 'dom' | 'comment' | 'three' = 'dom';

  debugNodeFactory?: () => DebugNode;

  instance?: NgtInstanceNode;
  parent?: NgtInstanceNode;

  dom?: HTMLElement | Comment;

  parentDom?: HTMLElement;

  cleanUps = new Set<() => void>();

  ref?: ElementRef<NgtInstanceNode>;
  for?: string;

  constructor(partial: Partial<NgtRendererState> = {}) {
    this.threeType = partial.threeType;
    this.nodeType = partial.nodeType!;
    this.debugNodeFactory = partial.debugNodeFactory;
    this.instance = partial.instance;
    this.parent = partial.parent;
    this.dom = partial.dom;
    this.parentDom = partial.parentDom;
    this.ref = partial.ref;
    this.for = partial.for;
  }
}
