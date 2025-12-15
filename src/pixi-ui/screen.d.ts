import type { Container } from 'pixi.js';

export interface BaseScreen {
    group: Container;
    show(): void;
    hide(): void;
    handleLandscape(scaleFactor: number): void;
    handlePortrait(scaleFactor: number): void;
}