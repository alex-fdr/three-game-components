import { World as e, NaiveBroadphase as i } from "cannon-es";
class r {
  timeStep = 1 / 60;
  lastCallTime = 0;
  maxSubSteps = 3;
  world;
  constructor(t) {
    const { gravity: s = { x: 0, y: -10, z: 0 } } = t;
    this.world = new e(), this.world.broadphase = new i(), this.world.gravity.set(s.x, s.y, s.z);
  }
  update(t) {
    if (!this.lastCallTime) {
      this.world.step(this.timeStep), this.lastCallTime = t;
      return;
    }
    const s = (t - this.lastCallTime) / 1e3;
    this.world.step(this.timeStep, s, this.maxSubSteps), this.lastCallTime = t;
  }
}
export {
  r as Physics
};
