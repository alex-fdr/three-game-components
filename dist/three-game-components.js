import { LoopRepeat as w, LoopOnce as y, AnimationMixer as x, Mesh as p, Color as m } from "three";
import { assets as f } from "@alexfdr/three-game-core";
import * as I from "three/addons/utils/SkeletonUtils";
import { World as O, NaiveBroadphase as b } from "cannon-es";
import { Easing as a, Group as C, Tween as S } from "@tweenjs/tween.js";
class T {
  mixers = /* @__PURE__ */ new Map();
  animationsList = [];
  enabled = !0;
  add(e, t, n = !1, s = 1) {
    const o = this.addMixer(e).clipAction(t);
    return o.timeScale = s, o.clampWhenFinished = !0, o.setLoop(n ? w : y, 1 / 0), this.animationsList.push(o), o;
  }
  addMixer(e) {
    this.mixers.has(e.uuid) || this.mixers.set(e.uuid, new x(e));
    const t = this.mixers.get(e.uuid);
    if (!t)
      throw new Error("no animation mixer found");
    return t;
  }
  onAnimationComplete(e, t, n = !0) {
    const s = e.getMixer(), i = () => {
      n && s.removeEventListener("finished", i), t?.();
    };
    s.addEventListener("finished", i);
  }
  update(e) {
    if (this.enabled)
      for (const [, t] of this.mixers)
        t.update(e);
  }
  parse(e) {
    const t = {
      mesh: null,
      anims: {},
      // animationsList: [],
      keys: []
    };
    for (const { key: n } of e) {
      const s = f.models.get(n);
      s.getObjectByProperty("type", "SkinnedMesh") && (t.mesh = I.clone(s));
    }
    if (!t.mesh)
      throw new Error("could not parse animations data, no base mesh found");
    for (const n of e) {
      const { key: s } = n, i = f.models.getAnimations(s);
      if (i.length) {
        const { name: o = s, loop: r = !1, timeScale: c = 1, clipId: u = 0 } = n, d = this.add(t.mesh, i[u], r, c);
        t.anims[o] = d, t.keys.push(o);
      }
    }
    return t;
  }
}
const B = new T();
class v {
  timeStep = 1 / 60;
  lastCallTime = 0;
  maxSubSteps = 3;
  world;
  constructor() {
    this.world = new O(), this.world.broadphase = new b();
  }
  init(e) {
    const { gravity: t = { x: 0, y: -10, z: 0 } } = e;
    this.world.gravity.set(t.x, t.y, t.z);
  }
  update(e) {
    if (!this.lastCallTime) {
      this.world.step(this.timeStep), this.lastCallTime = e;
      return;
    }
    const t = (e - this.lastCallTime) / 1e3;
    this.world.step(this.timeStep, t, this.maxSubSteps), this.lastCallTime = e;
  }
}
const F = new v(), E = {
  linear: a.Linear.None,
  quad: a.Quadratic.InOut,
  quadIn: a.Quadratic.In,
  quadOut: a.Quadratic.Out,
  cubic: a.Cubic.InOut,
  cubicIn: a.Cubic.In,
  cubicOut: a.Cubic.Out,
  quar: a.Quartic.InOut,
  quarIn: a.Quartic.In,
  quarOut: a.Quartic.Out,
  quint: a.Quintic.InOut,
  quintIn: a.Quintic.In,
  quintOut: a.Quintic.Out,
  sine: a.Sinusoidal.InOut,
  sineIn: a.Sinusoidal.In,
  sineOut: a.Sinusoidal.Out,
  exp: a.Exponential.InOut,
  expIn: a.Exponential.In,
  expOut: a.Exponential.Out,
  circ: a.Circular.InOut,
  circIn: a.Circular.In,
  circOut: a.Circular.Out,
  elastic: a.Elastic.InOut,
  elasticIn: a.Elastic.In,
  elasticOut: a.Elastic.Out,
  back: a.Back.InOut,
  backIn: a.Back.In,
  backOut: a.Back.Out,
  bounce: a.Bounce.InOut,
  bounceIn: a.Bounce.In,
  bounceOut: a.Bounce.Out
};
class k {
  tweens = [];
  group = new C();
  add(e, t = 300, {
    easing: n = "sine",
    autostart: s = !0,
    delay: i = 0,
    repeat: o = 0,
    repeatDelay: r = 0,
    yoyo: c = !1,
    to: u,
    onComplete: d
  } = {}) {
    if (!u)
      throw new Error("no destination provided");
    const l = new S(e).to(u, t).easing(E[n]).delay(i).repeat(o === -1 ? 1 / 0 : o).repeatDelay(r).yoyo(c);
    return s && l.start(), d && l.onComplete(d), this.tweens.push(l), this.group.add(l), l;
  }
  remove(e) {
    this.group.remove(e), this.tweens.splice(this.tweens.indexOf(e), 1);
  }
  pause() {
    for (const e of this.tweens)
      e.pause();
  }
  resume() {
    for (const e of this.tweens)
      e.resume();
  }
  update(e) {
    this.group.update(e);
  }
  wait(e) {
    const t = { value: 0 }, n = { value: 1 }, s = this.add(t, e, {
      easing: "linear",
      autostart: !0,
      to: n
    });
    return new Promise((i) => {
      s.onComplete(() => i());
    });
  }
  dummy(e, t) {
    return this.add({ value: 0 }, e, {
      ...t,
      easing: "linear",
      to: { value: 1 }
    });
  }
  fadeIn(e, t = 300, n = {}) {
    e.alpha = 0;
    const { autostart: s, delay: i } = n, o = this.add(e, t, {
      ...n,
      to: { alpha: 1 }
    });
    return (s === !1 || i) && o.onStart(() => {
      e.alpha = 0;
    }), o;
  }
  fadeOut(e, t = 200, n) {
    return this.add(e, t, {
      ...n,
      to: { alpha: 0 }
    });
  }
  zoomIn(e, t = 300, n = { scaleFrom: 0.9 }) {
    const { scaleFrom: s } = n, i = e.scale.x || 1;
    return e.scale.x = s, e.scale.y = s, this.add(e.scale, t, {
      ...n,
      to: { x: i, y: i }
    });
  }
  zoomOut(e, t = 300, n = { scaleTo: 1.1 }) {
    return this.add(e.scale, t, {
      ...n,
      to: { x: n.scaleTo, y: n.scaleTo }
    });
  }
  pulse(e, t = 300, n = { scaleTo: 1.1 }) {
    const s = n.scaleTo, i = e.scale;
    return this.add(e.scale, t, {
      ...n,
      yoyo: !0,
      repeat: n?.repeat ?? 1,
      to: { x: i.x * s, y: i.y * s }
    });
  }
  fadeIn3(e, t, n) {
    if (!e.material) {
      let i;
      if (e.traverse((o) => {
        o instanceof p && (i = this.fadeIn3(o, t, n));
      }), !i)
        throw new Error("cannot create a tween, no nested mesh found");
      return i;
    }
    const s = e.material.opacity || 1;
    return e.material.transparent = !0, e.material.opacity = 0, this.add(e.material, t, {
      ...n,
      to: { opacity: s }
    });
  }
  fadeOut3(e, t, n) {
    if (!e.material) {
      let s;
      if (e.traverse((i) => {
        i instanceof p && (s = this.fadeOut3(i, t, n));
      }), !s)
        throw new Error("cannot create a tween, no nested mesh found");
      return s;
    }
    return e.material.transparent = !0, this.add(e.material, t, {
      ...n,
      to: { opacity: 0 }
    });
  }
  zoomIn3(e, t, n = { scaleFrom: 0.9 }) {
    const { x: s, y: i, z: o } = e.scale, { scaleFrom: r } = n;
    return e.scale.multiplyScalar(r), this.add(e.scale, t, {
      ...n,
      to: { x: s, y: i, z: o }
    });
  }
  pulse3(e, t = 300, n = { scaleTo: 1.1 }) {
    const { scaleTo: s } = n, i = e.scale;
    return this.add(e.scale, t, {
      ...n,
      easing: "cubic",
      yoyo: !0,
      to: { x: i.x * s, y: i.y * s, z: i.z * s }
    });
  }
  switchColor3(e, t, n, s) {
    const i = new m(e.material.color), o = new m(t), r = new m(), c = this.dummy(n, { ...s, easing: "sineIn" });
    return c.onUpdate((u) => {
      r.copy(i), r.lerp(o, u.value), e.material.color.setHex(r.getHex());
    }), c;
  }
}
const M = new k();
export {
  B as animations,
  F as physics,
  M as tweens
};
