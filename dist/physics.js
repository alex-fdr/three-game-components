var l = Object.defineProperty;
var a = (i, t, s) => t in i ? l(i, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[t] = s;
var e = (i, t, s) => a(i, typeof t != "symbol" ? t + "" : t, s);
import { World as h, NaiveBroadphase as r } from "cannon-es";
class p {
  constructor(t) {
    e(this, "timeStep");
    e(this, "lastCallTime");
    e(this, "maxSubSteps");
    e(this, "world");
    const { gravity: s } = t;
    this.timeStep = 1 / 60, this.lastCallTime = 0, this.maxSubSteps = 3, this.world = new h(), this.world.broadphase = new r(), this.world.gravity.set(s.x, s.y, s.z);
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
  p as Physics
};
