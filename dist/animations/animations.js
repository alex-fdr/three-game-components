import { LoopRepeat as c, LoopOnce as h, AnimationMixer as l } from "three";
import { assets as a } from "@alexfdr/three-game-core";
import * as f from "three/addons/utils/SkeletonUtils";
class u {
  mixers = /* @__PURE__ */ new Map();
  animationsList = [];
  enabled = !0;
  add(i, e, s = !1, n = 1) {
    const t = this.addMixer(i).clipAction(e);
    return t.timeScale = n, t.clampWhenFinished = !0, t.setLoop(s ? c : h, 1 / 0), this.animationsList.push(t), t;
  }
  addMixer(i) {
    this.mixers.has(i.uuid) || this.mixers.set(i.uuid, new l(i));
    const e = this.mixers.get(i.uuid);
    if (!e)
      throw new Error("no animation mixer found");
    return e;
  }
  onAnimationComplete(i, e, s = !0) {
    const n = i.getMixer(), o = () => {
      s && n.removeEventListener("finished", o), e?.();
    };
    n.addEventListener("finished", o);
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
      const n = a.models.get(s);
      n.getObjectByProperty("type", "SkinnedMesh") && (e.mesh = f.clone(n));
    }
    if (!e.mesh)
      throw new Error("could not parse animations data, no base mesh found");
    for (const s of i) {
      const { key: n } = s, o = a.models.getAnimations(n);
      if (o.length) {
        const { name: t = n, loop: m = !1, timeScale: d = 1, clipId: p = 0 } = s, r = this.add(e.mesh, o[p], m, d);
        e.animationsMap.set(t, r), e.animationsList.push(r), e.keys.push(t);
      }
    }
    return e;
  }
}
const w = new u();
export {
  w as animations
};
