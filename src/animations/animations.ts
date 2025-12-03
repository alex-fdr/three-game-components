import {
    type AnimationAction,
    type AnimationClip,
    AnimationMixer,
    LoopOnce,
    LoopRepeat,
    type Object3D,
} from 'three';
import { assets } from '@alexfdr/three-game-core';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils';

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

export class AnimationSystem {
    mixers: Map<string, AnimationMixer> = new Map();
    animationsList: AnimationAction[] = [];
    enabled = true;

    add(targetMesh: Object3D, animationSource: AnimationClip, loop = false, timeScale = 1) {
        const mixer = this.addMixer(targetMesh);
        const anim = mixer.clipAction(animationSource);
        anim.timeScale = timeScale;
        anim.clampWhenFinished = true;
        anim.setLoop(loop ? LoopRepeat : LoopOnce, Infinity);
        this.animationsList.push(anim);
        return anim;
    }

    addMixer(target: Object3D): AnimationMixer | never {
        if (!this.mixers.has(target.uuid)) {
            this.mixers.set(target.uuid, new AnimationMixer(target));
        }

        const mixer = this.mixers.get(target.uuid);

        if (!mixer) {
            throw new Error('no animation mixer found');
        }

        return mixer;
    }

    onAnimationComplete(anim: AnimationAction, callback: () => void, once = true) {
        const mixer = anim.getMixer();

        const handler = () => {
            if (once) {
                mixer.removeEventListener('finished', handler);
            }

            callback?.();
        };

        mixer.addEventListener('finished', handler);
    }

    update(dt: number) {
        if (!this.enabled) {
            return;
        }

        for (const [, mixer] of this.mixers) {
            mixer.update(dt);
        }
    }

    parse(animationsMap: AnimationData[]): ParsedAnimationData | never {
        const result: ParsedAnimationData = {
            mesh: null,
            animationsMap: new Map(),
            animationsList: [],
            keys: [],
        };

        for (const { key } of animationsMap) {
            const model = assets.models.get(key);

            if (model.getObjectByProperty('type', 'SkinnedMesh')) {
                result.mesh = SkeletonUtils.clone(model);
            }
        }

        if (!result.mesh) {
            throw new Error('could not parse animations data, no base mesh found');
        }

        for (const props of animationsMap) {
            const { key } = props;
            const anims = assets.models.getAnimations(key);

            if (anims.length) {
                const { name = key, loop = false, timeScale = 1, clipId = 0 } = props;
                const anim = this.add(result.mesh, anims[clipId], loop, timeScale);
                result.animationsMap.set(name, anim);
                result.animationsList.push(anim);
                result.keys.push(name);
            }
        }

        return result;
    }
}

