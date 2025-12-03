import { AnimationAction, AnimationClip, AnimationMixer, Object3D } from 'three';
export type AnimationData = {
    key: string;
    name: string;
    loop?: boolean;
    timeScale?: number;
    clipId?: number;
};
export type ParsedAnimationData = {
    mesh: Object3D | null;
    animationsMap: Map<string, AnimationAction>;
    animationsList: AnimationAction[];
    keys: string[];
};
export declare class AnimationSystem {
    mixers: Map<string, AnimationMixer>;
    animationsList: AnimationAction[];
    enabled: boolean;
    add(targetMesh: Object3D, animationSource: AnimationClip, loop?: boolean, timeScale?: number): AnimationAction;
    addMixer(target: Object3D): AnimationMixer | never;
    onAnimationComplete(anim: AnimationAction, callback: () => void, once?: boolean): void;
    update(dt: number): void;
    parse(animationsMap: AnimationData[]): ParsedAnimationData | never;
}
