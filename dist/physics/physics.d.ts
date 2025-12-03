import { World } from 'cannon-es';
import { Vector3Like } from 'three';
export type PhysicsProps = {
    gravity?: Vector3Like;
};
export declare class Physics {
    timeStep: number;
    lastCallTime: number;
    maxSubSteps: number;
    world: World;
    constructor(config: PhysicsProps);
    update(time: number): void;
}
