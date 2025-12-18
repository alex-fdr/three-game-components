import { AnimationAction } from 'three';
import { AnimationClip } from 'three';
import { AnimationMixer } from 'three';
import { BaseScreen } from './screen';
import { Color } from 'three';
import { ColorRepresentation } from 'three';
import { Container } from 'pixi.js';
import { Group } from '@tweenjs/tween.js';
import { Material } from 'three';
import { Object3D } from 'three';
import { Tween } from '@tweenjs/tween.js';
import { Vector3 } from 'three';
import { Vector3Like } from 'three';
import { WebGLRenderer } from 'pixi.js';
import { WebGLRenderer as WebGLRenderer_2 } from 'three';
import { World } from 'cannon-es';

declare type AddProps<T> = Partial<TweenProps & {
    to: ToProps<T>;
}>;

declare type AlphaProperty = {
    alpha: number;
};

export declare type AnimationData = {
    key: string;
    name: string;
    loop?: boolean;
    timeScale?: number;
    clipId?: number;
};

export declare const animations: AnimationSystem;

declare class AnimationSystem {
    mixers: Map<string, AnimationMixer>;
    animationsList: AnimationAction[];
    enabled: boolean;
    add(targetMesh: Object3D, animationSource: AnimationClip, loop?: boolean, timeScale?: number): AnimationAction;
    addMixer(target: Object3D): AnimationMixer | never;
    onAnimationComplete(anim: AnimationAction, callback: () => void, once?: boolean): void;
    update(dt: number): void;
    parse(animationsMap: AnimationData[]): ParsedAnimationData<AnimationData> | never;
}

export { BaseScreen }

declare type CustomTween = Tween<any>;

declare class HtmlScreens {
    domElements: Record<string, HTMLElement>;
    add(name: string): void;
    show(name: string): void;
    hide(name: string): void;
    getScreen(name: string): HTMLElement;
}

export declare const htmlScreens: HtmlScreens;

declare const mapping: {
    linear: (amount: number) => number;
    quad: (amount: number) => number;
    quadIn: (amount: number) => number;
    quadOut: (amount: number) => number;
    cubic: (amount: number) => number;
    cubicIn: (amount: number) => number;
    cubicOut: (amount: number) => number;
    quar: (amount: number) => number;
    quarIn: (amount: number) => number;
    quarOut: (amount: number) => number;
    quint: (amount: number) => number;
    quintIn: (amount: number) => number;
    quintOut: (amount: number) => number;
    sine: (amount: number) => number;
    sineIn: (amount: number) => number;
    sineOut: (amount: number) => number;
    exp: (amount: number) => number;
    expIn: (amount: number) => number;
    expOut: (amount: number) => number;
    circ: (amount: number) => number;
    circIn: (amount: number) => number;
    circOut: (amount: number) => number;
    elastic: (amount: number) => number;
    elasticIn: (amount: number) => number;
    elasticOut: (amount: number) => number;
    back: (amount: number) => number;
    backIn: (amount: number) => number;
    backOut: (amount: number) => number;
    bounce: (amount: number) => number;
    bounceIn: (amount: number) => number;
    bounceOut: (amount: number) => number;
};

declare type MaterialColorProperty = Object3D & {
    material: Material & {
        color: Color;
    };
};

declare type MaterialProperty = Object3D & {
    material?: Material;
};

declare type ParsedAnimationData<T extends {
    key: string;
}> = {
    mesh: Object3D | null;
    anims: Record<T['key'], AnimationAction>;
    keys: T['key'][];
};

declare class Physics {
    timeStep: number;
    lastCallTime: number;
    maxSubSteps: number;
    world: World;
    constructor();
    init(config: PhysicsProps): void;
    update(time: number): void;
}

export declare const physics: Physics;

export declare type PhysicsProps = {
    gravity?: Vector3Like;
};

declare class PixiUI {
    renderer: WebGLRenderer<HTMLCanvasElement>;
    stage: Container;
    screens: Map<string, BaseScreen>;
    init(threeRenderer: WebGLRenderer_2, width: number, height: number): Promise<void>;
    resize(width: number, height: number): void;
    render(): void;
}

export declare const pixiUI: PixiUI;

declare type ScaleProperty = {
    scale: {
        x: number;
        y: number;
        z?: number;
    };
};

declare type ToProps<T> = Partial<Record<keyof T, number | string>>;

declare type TweenProps = {
    time: number;
    easing: keyof typeof mapping;
    autostart: boolean;
    delay: number;
    repeat: number;
    repeatDelay: number;
    yoyo: boolean;
    to: unknown;
    onComplete: (object: unknown) => void;
};

export declare const tweens: TweensFactory;

declare class TweensFactory {
    tweens: CustomTween[];
    group: Group;
    add<T extends Record<string, any>>(target: T, { time, easing, autostart, delay, repeat, repeatDelay, yoyo, to, onComplete, }?: AddProps<T>): CustomTween;
    remove(tween: CustomTween): void;
    pause(): void;
    resume(): void;
    update(time: number): void;
    wait(time: number): Promise<void>;
    dummy(props: Partial<TweenProps>): CustomTween;
    fadeIn(target: AlphaProperty, props?: Partial<TweenProps>): CustomTween;
    fadeOut(target: AlphaProperty, props: TweenProps): CustomTween;
    zoomIn(target: ScaleProperty, props?: Partial<TweenProps> & {
        scaleFrom: number;
    }): CustomTween;
    zoomOut(target: ScaleProperty, props?: Partial<TweenProps> & {
        scaleTo: number;
    }): CustomTween;
    pulse(target: ScaleProperty, props?: Partial<TweenProps> & {
        scaleTo: number;
    }): CustomTween;
    fadeIn3(target: MaterialProperty, props: Partial<TweenProps>): CustomTween | never;
    fadeOut3(target: MaterialProperty, props: Partial<TweenProps>): CustomTween | never;
    zoomIn3(target: {
        scale: Vector3;
    }, props?: Partial<TweenProps> & {
        scaleFrom: number;
    }): CustomTween;
    zoomOut3(target: {
        scale: Vector3;
    }, props?: Partial<TweenProps> & {
        scaleTo: number;
    }): CustomTween;
    pulse3(target: {
        scale: Vector3;
    }, props?: Partial<TweenProps> & {
        scaleTo: number;
    }): CustomTween;
    switchColor3(target: MaterialColorProperty, color: ColorRepresentation, props: Partial<TweenProps>): CustomTween;
}

export { }
