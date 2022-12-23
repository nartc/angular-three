import { ChangeDetectorRef, Provider, RendererFactory2 } from "@angular/core";
import { NgtStore } from "../stores/store";
import { NgtRendererFactory } from "./renderer";

export function provideNgtRenderer(rootStore: NgtStore, rootCdr: ChangeDetectorRef): Provider {
    return [
        {provide: NgtStore, useValue: rootStore},
        {provide: ChangeDetectorRef, useValue: rootCdr},
        {provide: RendererFactory2, useClass: NgtRendererFactory}
    ]
}

