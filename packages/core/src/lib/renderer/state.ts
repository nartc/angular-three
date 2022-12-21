import { DebugNode, ElementRef } from '@angular/core';
import type { NgtInstanceNode } from '../types';

export class NgtRendererState {
  // which THREE object type
  // normal: normal THREE
  // scene: root Scene
  // portal: a Portal w/ container (usually a scene)
  // wrapper: a normal Angular component that wraps a normal THREE
  threeType?: 'normal' | 'scene' | 'portal' | 'wrapper';

  // which node type
  // dom: regular dom node. Angular component is a 'dom' node type. Wrapper also has 'dom' but only initially
  // comment: comment node
  // three: THREE objects as well as Wrapper after getting its instance is 'three'
  nodeType: 'dom' | 'comment' | 'three' = 'dom';

  // a factory to get the DebugNode
  debugNodeFactory?: () => DebugNode;

  // THREE instance associated with this node
  instance?: NgtInstanceNode;
  // Parent THREE instance assocaited with this node
  parent?: NgtInstanceNode;

  // dom or comment associated with this node
  dom?: HTMLElement | Comment;

  // parentDom associated with this node
  parentDom?: HTMLElement;

  // clean ups from event listeners
  cleanUps = new Set<() => void>();

  // whether the consumers use *ref
  ref?: ElementRef<NgtInstanceNode>;
  // if this is a Comment node by Structural Directive, what's it for
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
