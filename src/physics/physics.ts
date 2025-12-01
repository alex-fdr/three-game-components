import { NaiveBroadphase, World } from 'cannon-es';
import type { Vector3Like } from 'three';

export type PhysicsProps = {
    gravity: Vector3Like;
};

export class Physics {
    timeStep: number;
    lastCallTime: number;
    maxSubSteps: number;
    world: World;

    constructor(config: PhysicsProps) {
        const { gravity } = config;

        this.timeStep = 1 / 60;
        this.lastCallTime = 0;
        this.maxSubSteps = 3;

        this.world = new World();
        this.world.broadphase = new NaiveBroadphase();
        this.world.gravity.set(gravity.x, gravity.y, gravity.z);
    }

    update(time: number): void {
        if (!this.lastCallTime) {
            this.world.step(this.timeStep);
            this.lastCallTime = time;
            return;
        }

        const timeSinceLastCalled = (time - this.lastCallTime) / 1000;
        this.world.step(this.timeStep, timeSinceLastCalled, this.maxSubSteps);
        this.lastCallTime = time;
    }
}
