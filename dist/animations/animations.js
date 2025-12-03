var u = Object.defineProperty;
var c = (o, i, e) => i in o ? u(o, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[i] = e;
var m = (o, i, e) => c(o, typeof i != "symbol" ? i + "" : i, e);
import { LoopRepeat as l, LoopOnce as x, AnimationMixer as y } from "three";
import { assets as d } from "@alexfdr/three-game-core";
import * as L from "three/addons/utils/SkeletonUtils";
class w {
  constructor() {
    m(this, "mixers", /* @__PURE__ */ new Map());
    m(this, "animationsList", []);
    m(this, "enabled", !0);
  }
  add(i, e, s = !1, n = 1) {
    const t = this.addMixer(i).clipAction(e);
    return t.timeScale = n, t.clampWhenFinished = !0, t.setLoop(s ? l : x, 1 / 0), this.animationsList.push(t), t;
  }
  addMixer(i) {
    this.mixers.has(i.uuid) || this.mixers.set(i.uuid, new y(i));
    const e = this.mixers.get(i.uuid);
    if (!e)
      throw new Error("no animation mixer found");
    return e;
  }
  onAnimationComplete(i, e, s = !0) {
    const n = i.getMixer(), r = () => {
      s && n.removeEventListener("finished", r), e == null || e();
    };
    n.addEventListener("finished", r);
  }
  update(i) {
    if (this.enabled)
      for (const [, e] of this.mixers)
        e.update(i);
  }
  parse(i) {
    const e = {
      mesh: null,
      animationsMap: /* @__PURE__ */ new Map(),
      animationsList: [],
      keys: []
    };
    for (const { key: s } of i) {
      const n = d.models.get(s);
      n.getObjectByProperty("type", "SkinnedMesh") && (e.mesh = L.clone(n));
    }
    if (!e.mesh)
      throw new Error("could not parse animations data, no base mesh found");
    for (const s of i) {
      const { key: n } = s, r = d.models.getAnimations(n);
      if (r.length) {
        const { name: t = n, loop: p = !1, timeScale: h = 1, clipId: f = 0 } = s, a = this.add(e.mesh, r[f], p, h);
        e.animationsMap.set(t, a), e.animationsList.push(a), e.keys.push(t);
      }
    }
    return e;
  }
}
const E = new w();
export {
  E as animations
};
