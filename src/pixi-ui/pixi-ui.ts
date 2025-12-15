import type { WebGLRenderer as ThreeWebGLRenderer } from 'three';
import { Container, WebGLRenderer } from 'pixi.js';
import type { BaseScreen } from './screen';

export class PixiUI {
    renderer: WebGLRenderer<HTMLCanvasElement> = new WebGLRenderer();
    stage: Container = new Container();
    screens: Map<string, BaseScreen> = new Map();

    async init(threeRenderer: ThreeWebGLRenderer, width: number, height: number): Promise<void> {
        const context = threeRenderer.getContext();

        if (context && context instanceof WebGL2RenderingContext) {
            await this.renderer.init({
                context,
                width,
                height,
                clearBeforeRender: false,
            });
        }
    }

    resize(width: number, height: number): void {
        const aspectRatio = width / height;
        const scaleFactor = 1 / aspectRatio;
        const method = width > height ? 'handleLandscape' : 'handlePortrait';

        // center coordinate system
        this.stage.position.set(width * 0.5, height * 0.5);

        for (const [, screen] of this.screens) {
            screen[method](scaleFactor);
        }

        this.renderer.resize(width, height);
    }

    render(): void {
        this.renderer.resetState();
        this.renderer.render(this.stage);
    }
}
