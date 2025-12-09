var y = Object.defineProperty;
var x = (c, e, t) => e in c ? y(c, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[e] = t;
var r = (c, e, t) => x(c, typeof e != "symbol" ? e + "" : e, t);
import { LoopRepeat as I, LoopOnce as O, AnimationMixer as C, Mesh as p, Color as f } from "three";
import { assets as w } from "@alexfdr/three-game-core";
import * as S from "three/addons/utils/SkeletonUtils";
import { World as T, NaiveBroadphase as b } from "cannon-es";
import { Easing as a, Group as v, Tween as E } from "@tweenjs/tween.js";
class z {
  constructor() {
    r(this, "mixers", /* @__PURE__ */ new Map());
    r(this, "animationsList", []);
    r(this, "enabled", !0);
  }
  add(e, t, n = !1, s = 1) {
    const o = this.addMixer(e).clipAction(t);
    return o.timeScale = s, o.clampWhenFinished = !0, o.setLoop(n ? I : O, 1 / 0), this.animationsList.push(o), o;
  }
  addMixer(e) {
    this.mixers.has(e.uuid) || this.mixers.set(e.uuid, new C(e));
    const t = this.mixers.get(e.uuid);
    if (!t)
      throw new Error("no animation mixer found");
    return t;
  }
  onAnimationComplete(e, t, n = !0) {
    const s = e.getMixer(), i = () => {
      n && s.removeEventListener("finished", i), t == null || t();
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
      const s = w.models.get(n);
      s.getObjectByProperty("type", "SkinnedMesh") && (t.mesh = S.clone(s));
    }
    if (!t.mesh)
      throw new Error("could not parse animations data, no base mesh found");
    for (const n of e) {
      const { key: s } = n, i = w.models.getAnimations(s);
      if (i.length) {
        const { name: o = s, loop: u = !1, timeScale: l = 1, clipId: d = 0 } = n, h = this.add(t.mesh, i[d], u, l);
        t.anims[o] = h, t.keys.push(o);
      }
    }
    return t;
  }
}
const A = new z();
class P {
  constructor(e) {
    r(this, "timeStep", 1 / 60);
    r(this, "lastCallTime", 0);
    r(this, "maxSubSteps", 3);
    r(this, "world");
    const { gravity: t = { x: 0, y: -10, z: 0 } } = e;
    this.world = new T(), this.world.broadphase = new b(), this.world.gravity.set(t.x, t.y, t.z);
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
const q = {
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
class L {
  constructor() {
    r(this, "tweens", []);
    r(this, "group", new v());
  }
  add(e, t = 300, {
    easing: n = "sine",
    autostart: s = !0,
    delay: i = 0,
    repeat: o = 0,
    repeatDelay: u = 0,
    yoyo: l = !1,
    to: d,
    onComplete: h
  } = {}) {
    if (!d)
      throw new Error("no destination provided");
    const m = new E(e).to(d, t).easing(q[n]).delay(i).repeat(o === -1 ? 1 / 0 : o).repeatDelay(u).yoyo(l);
    return s && m.start(), h && m.onComplete(h), this.tweens.push(m), this.group.add(m), m;
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
      repeat: (n == null ? void 0 : n.repeat) ?? 1,
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
    const { x: s, y: i, z: o } = e.scale, { scaleFrom: u } = n;
    return e.scale.multiplyScalar(u), this.add(e.scale, t, {
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
    const i = new f(e.material.color), o = new f(t), u = new f(), l = this.dummy(n, { ...s, easing: "sineIn" });
    return l.onUpdate((d) => {
      u.copy(i), u.lerp(o, d.value), e.material.color.setHex(u.getHex());
    }), l;
  }
}
const H = new L();
export {
  P as Physics,
  A as animations,
  H as tweens
};
