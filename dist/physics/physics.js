var l = Object.defineProperty;
var a = (e, t, s) => t in e ? l(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var i = (e, t, s) => a(e, typeof t != "symbol" ? t + "" : t, s);
import { World as r, NaiveBroadphase as o } from "cannon-es";
class d {
  constructor(t) {
    i(this, "timeStep", 1 / 60);
    i(this, "lastCallTime", 0);
    i(this, "maxSubSteps", 3);
    i(this, "world");
    const { gravity: s = { x: 0, y: 0, z: 0 } } = t;
    this.world = new r(), this.world.broadphase = new o(), this.world.gravity.set(s.x, s.y, s.z);
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
  d as Physics
};
