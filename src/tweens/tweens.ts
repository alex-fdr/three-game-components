import { Group, Tween } from '@tweenjs/tween.js';
import { mapping } from './mapping';
import { Color, Mesh } from 'three';
import type { Material, Object3D, Vector3, ColorRepresentation } from 'three';

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
type AddProps<T> = Partial<TweenProps & { to: ToProps<T> }>
type CustomTween = Tween<any>;

type AlphaProperty = {
    alpha: number;
};

type ScaleProperty = {
    scale: { x: number, y: number, z?: number }
}

type MaterialProperty = Object3D & { material?:  Material }
type MaterialColorProperty = Object3D & { material: Material & { color: Color }}

export class TweensFactory {
    tweens: CustomTween[] = [];
    group = new Group();

    add<T extends Record<string, any>>(
        target: T, 
        time = 300, 
        {
            easing = 'sine',
            autostart = true,
            delay = 0,
            repeat = 0,
            repeatDelay = 0,
            yoyo = false,
            to,
            onComplete
        }: AddProps<T> = {}
    ): CustomTween {

        if (!to) {
            throw new Error('no destination provided');
        };

        const tween = new Tween(target)
            .to(to, time)
            .easing(mapping[easing])
            .delay(delay)
            .repeat(repeat === -1 ? Infinity : repeat)
            .repeatDelay(repeatDelay)
            .yoyo(yoyo);

        if (autostart) {
            tween.start();
        }

        if (onComplete) {
            tween.onComplete(onComplete);
        }

        this.tweens.push(tween);
        this.group.add(tween);
        return tween;
    }

    remove(tween: CustomTween): void {
        this.group.remove(tween);
        this.tweens.splice(this.tweens.indexOf(tween), 1);
    }

    pause(): void {
        for (const tween of this.tweens) {
            tween.pause();
        }
    }

    resume(): void {
        for (const tween of this.tweens) {
            tween.resume();
        }
    }

    update(time: number): void {
        this.group.update(time);
    }

    wait(time: number): Promise<void> {
        const from = { value: 0 };
        const to = { value: 1 };
        const tween = this.add(from, time, {
            easing: 'linear',
            autostart: true,
            to,
        });
        
        return new Promise((resolve) => {
            tween.onComplete(() => resolve());
        });
    }

    dummy(time: number, props: TweenProps): CustomTween {
        return this.add({ value: 0 }, time, {
            ...props,
            easing: 'linear',
            to: { value: 1 },
        });
    }

    fadeIn(target: AlphaProperty, time = 300, props: TweenProps): CustomTween {
        target.alpha = 0;

        const tween = this.add(target, time, {
            ...props,
            to: { alpha: 1 },
        });

        if (props.autostart === false || props.delay) {
            tween.onStart(() => {
                target.alpha = 0;
            });
        }

        return tween;
    }

    fadeOut(target: AlphaProperty, time = 200, props: TweenProps): CustomTween {
        return this.add(target, time, {
            ...props,
            to: { alpha: 0 },
        });
    }

    zoomIn(target: ScaleProperty, scaleFrom = 0, time = 300, props: TweenProps): CustomTween {
        const scaleTo = target.scale.x || 1;
        target.scale.x = scaleFrom
        target.scale.y = scaleFrom
        return this.add(target.scale, time, {
            ...props,
            to: { x: scaleTo, y: scaleTo }
        });
    }

    zoomOut(target: ScaleProperty, scaleTo = 0, time = 300, props = {}): CustomTween {
        return this.add(target.scale, time, { 
            ...props,
            to: { x: scaleTo, y: scaleTo }
        });
    }

    pulse(target: ScaleProperty, time = 300, props: TweenProps & { scaleTo: number }): CustomTween {
        const scaleTo = props.scaleTo || 1.1;
        const s = target.scale;
        return this.add(target.scale, time, {
            ...props,
            yoyo: true,
            repeat: props.repeat || 1,
            to: { x: s.x * scaleTo, y: s.y * scaleTo },
        });
    }

    fadeIn3(target: MaterialProperty, time: number, props: TweenProps): CustomTween | never {
        if (!target.material) {
            let tween;
            
            target.traverse((child) => {
                if (child instanceof Mesh) {
                    tween = this.fadeIn3(child, time, props);
                }
            })
            
            if (!tween) {
                throw new Error('cannot create a tween, no nested mesh found');
            }

            return tween;
        }

        const finalOpacity = target.material.opacity || 1;
        target.material.transparent = true;
        target.material.opacity = 0;
        return this.add(target.material, time, {
            ...props,
            to: { opacity: finalOpacity },
        });

    }

    fadeOut3(target: MaterialProperty, time: number, props: TweenProps): CustomTween | never {
        if (!target.material) {
            let tween;
            
            target.traverse((child) => {
                if (child instanceof Mesh) {
                    tween = this.fadeOut3(child, time, props);
                }
            });

            if (!tween) {
                throw new Error('cannot create a tween, no nested mesh found');
            }

            return tween;
        }

        target.material.transparent = true;
        return this.add(target.material, time, {
            ...props,
            to: { opacity: 0 },
        });
    }

    zoomIn3(target: { scale: Vector3 }, time: number, props: TweenProps & { scaleFrom: number }): CustomTween {
        const { x: sx, y: sy, z: sz } = target.scale;
        const scaleFrom = props.scaleFrom;
        target.scale.multiplyScalar(scaleFrom);
        return this.add(target.scale, time, {
            ...props,
            to: { x: sx, y: sy, z: sz },
        });
    }

    pulse3(target: { scale: Vector3 }, time = 300, props: TweenProps & { scaleTo: number }): CustomTween {
        const scaleTo = props.scaleTo || 1.1;
        const s = target.scale;
        return this.add(target.scale, time, {
            ...props,
            easing: 'cubic',
            yoyo: true,
            to: { x: s.x * scaleTo, y: s.y * scaleTo, z: s.z * scaleTo },
        });
    }

    switchColor3(target: MaterialColorProperty, color: ColorRepresentation, time: number, props: TweenProps): CustomTween {
        const oldColor = new Color(target.material.color);
        const newColor = new Color(color);
        const tempColor = new Color();
        const dummyTween = this.dummy(time, { ...props, easing: 'sineIn' });

        dummyTween.onUpdate((t) => {
            tempColor.copy(oldColor);
            tempColor.lerp(newColor, t.value);
            target.material.color.setHex(tempColor.getHex());
        });

        return dummyTween;
    }
}
