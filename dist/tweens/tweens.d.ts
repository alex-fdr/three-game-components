import { Group, Tween } from '@tweenjs/tween.js';
import { mapping } from './mapping';
import { Color, Material, Object3D, Vector3, ColorRepresentation } from 'three';
export type TweenProps = {
    easing: keyof typeof mapping;
    autostart: boolean;
    delay: number;
    repeat: number;
    repeatDelay: number;
    yoyo: boolean;
    to: unknown;
    onComplete: (object: any) => void;
};
type ToProps<T> = Partial<Record<keyof T, number | string>>;
type AddProps<T> = Partial<TweenProps & {
    to: ToProps<T>;
}>;
type CustomTween = Tween<any>;
type AlphaProperty = {
    alpha: number;
};
type ScaleProperty = {
    scale: {
        x: number;
        y: number;
        z?: number;
    };
};
type MaterialProperty = Object3D & {
    material?: Material;
};
type MaterialColorProperty = Object3D & {
    material: Material & {
        color: Color;
    };
};
export declare class TweensFactory {
    tweens: CustomTween[];
    group: Group;
    add<T extends Record<string, any>>(target: T, time?: number, { easing, autostart, delay, repeat, repeatDelay, yoyo, to, onComplete }?: AddProps<T>): CustomTween;
    remove(tween: CustomTween): void;
    pause(): void;
    resume(): void;
    update(time: number): void;
    wait(time: number): Promise<void>;
    dummy(time: number, props: TweenProps): CustomTween;
    fadeIn(target: AlphaProperty, time: number | undefined, props: TweenProps): CustomTween;
    fadeOut(target: AlphaProperty, time: number | undefined, props: TweenProps): CustomTween;
    zoomIn(target: ScaleProperty, scaleFrom: number | undefined, time: number | undefined, props: TweenProps): CustomTween;
    zoomOut(target: ScaleProperty, scaleTo?: number, time?: number, props?: {}): CustomTween;
    pulse(target: ScaleProperty, time: number | undefined, props: TweenProps & {
        scaleTo: number;
    }): CustomTween;
    fadeIn3(target: MaterialProperty, time: number, props: TweenProps): CustomTween | never;
    fadeOut3(target: MaterialProperty, time: number, props: TweenProps): CustomTween | never;
    zoomIn3(target: {
        scale: Vector3;
    }, time: number, props: TweenProps & {
        scaleFrom: number;
    }): CustomTween;
    pulse3(target: {
        scale: Vector3;
    }, time: number | undefined, props: TweenProps & {
        scaleTo: number;
    }): CustomTween;
    switchColor3(target: MaterialColorProperty, color: ColorRepresentation, time: number, props: TweenProps): CustomTween;
}
export {};
