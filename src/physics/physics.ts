import { NaiveBroadphase, World } from 'cannon-es';
import type { Vector3Like } from 'three';

export type PhysicsProps = {
    gravity?: Vector3Like;
};

export class Physics {
    timeStep = 1 / 60;
    lastCallTime = 0;
    maxSubSteps = 3;
    world: World;

    constructor(config: PhysicsProps) {
        const { gravity = { x: 0, y: 0, z: 0 } } = config;

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
