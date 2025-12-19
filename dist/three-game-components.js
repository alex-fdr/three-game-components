import { LoopRepeat as w, LoopOnce as y, AnimationMixer as x, Mesh as p, Color as m } from "three";
import { assets as f } from "@alexfdr/three-game-core";
import * as I from "three/addons/utils/SkeletonUtils";
import { World as O, NaiveBroadphase as E } from "cannon-es";
import { WebGLRenderer as S, Container as b } from "pixi.js";
import { Easing as i, Group as C, Tween as v } from "@tweenjs/tween.js";
class T {
  mixers = /* @__PURE__ */ new Map();
  animationsList = [];
  enabled = !0;
  add(e, t, s = !1, n = 1) {
    const a = this.addMixer(e).clipAction(t);
    return a.timeScale = n, a.clampWhenFinished = !0, a.setLoop(s ? w : y, 1 / 0), this.animationsList.push(a), a;
  }
  addMixer(e) {
    this.mixers.has(e.uuid) || this.mixers.set(e.uuid, new x(e));
    const t = this.mixers.get(e.uuid);
    if (!t)
      throw new Error("no animation mixer found");
    return t;
  }
  onAnimationComplete(e, t, s = !0) {
    const n = e.getMixer(), o = () => {
      s && n.removeEventListener("finished", o), t?.();
    };
    n.addEventListener("finished", o);
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
    for (const { key: s } of e) {
      const n = f.models.get(s);
      n.getObjectByProperty("type", "SkinnedMesh") && (t.mesh = I.clone(n));
    }
    if (!t.mesh)
      throw new Error("could not parse animations data, no base mesh found");
    for (const s of e) {
      const { key: n } = s, o = f.models.getAnimations(n);
      if (o.length) {
        const { name: a = n, loop: r = !1, timeScale: l = 1, clipId: d = 0 } = s, h = this.add(t.mesh, o[d], r, l);
        t.anims[a] = h, t.keys.push(a);
      }
    }
    return t;
  }
}
const R = new T();
class L {
  pool = {};
  on(e, t) {
    return this.has(e) || (this.pool[e] = []), this.pool[e].push(t), this;
  }
  once(e, t) {
    this.has(e) || (this.pool[e] = []);
    const s = this.pool[e].length;
    return this.pool[e].push((...n) => {
      t(...n), this.pool[e].splice(s, 1);
    }), this;
  }
  off(e) {
    return this.has(e) && delete this.pool[e], this;
  }
  emit(e, ...t) {
    if (this.has(e)) {
      const s = this.pool[e];
      for (const n of s)
        n(...t);
    }
    return this;
  }
  has(e) {
    return typeof this.pool[e] < "u";
  }
}
const U = new L();
class z {
  domElements = {};
  add(e) {
    const t = document.getElementById(e);
    if (!t)
      throw new Error(`no element with id=${e} found`);
    this.domElements[e] = t, t.addEventListener("animationend", () => {
      t.classList.contains("hiding") && t.classList.replace("hiding", "hidden");
    });
  }
  show(e) {
    this.getScreen(e).classList.replace("hidden", "shown");
  }
  hide(e) {
    this.getScreen(e).classList.replace("shown", "hiding");
  }
  getScreen(e) {
    const t = this.domElements[e];
    if (!t)
      throw new Error(`no screen with id=${e} found`);
    return t;
  }
}
const W = new z();
class k {
  timeStep = 1 / 60;
  lastCallTime = 0;
  maxSubSteps = 3;
  world;
  constructor() {
    this.world = new O(), this.world.broadphase = new E();
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
const G = new k();
class g {
  renderer = new S();
  stage = new b();
  screens = /* @__PURE__ */ new Map();
  async init(e, t, s) {
    const n = e.getContext();
    n && n instanceof WebGL2RenderingContext && (await this.renderer.init({
      context: n,
      width: t,
      height: s,
      clearBeforeRender: !1
    }), this.renderer.events.setTargetElement(e.domElement));
  }
  resize(e, t) {
    const n = 1 / (e / t), o = e > t ? "handleLandscape" : "handlePortrait";
    this.stage.position.set(e * 0.5, t * 0.5);
    for (const [, a] of this.screens)
      a[o](n);
    this.renderer.resize(e, t);
  }
  render() {
    this.renderer.resetState(), this.renderer.render({ container: this.stage });
  }
}
const H = new g(), B = {
  linear: i.Linear.None,
  quad: i.Quadratic.InOut,
  quadIn: i.Quadratic.In,
  quadOut: i.Quadratic.Out,
  cubic: i.Cubic.InOut,
  cubicIn: i.Cubic.In,
  cubicOut: i.Cubic.Out,
  quar: i.Quartic.InOut,
  quarIn: i.Quartic.In,
  quarOut: i.Quartic.Out,
  quint: i.Quintic.InOut,
  quintIn: i.Quintic.In,
  quintOut: i.Quintic.Out,
  sine: i.Sinusoidal.InOut,
  sineIn: i.Sinusoidal.In,
  sineOut: i.Sinusoidal.Out,
  exp: i.Exponential.InOut,
  expIn: i.Exponential.In,
  expOut: i.Exponential.Out,
  circ: i.Circular.InOut,
  circIn: i.Circular.In,
  circOut: i.Circular.Out,
  elastic: i.Elastic.InOut,
  elasticIn: i.Elastic.In,
  elasticOut: i.Elastic.Out,
  back: i.Back.InOut,
  backIn: i.Back.In,
  backOut: i.Back.Out,
  bounce: i.Bounce.InOut,
  bounceIn: i.Bounce.In,
  bounceOut: i.Bounce.Out
};
class q {
  tweens = [];
  group = new C();
  add(e, {
    time: t = 300,
    easing: s = "sine",
    autostart: n = !0,
    delay: o = 0,
    repeat: a = 0,
    repeatDelay: r = 0,
    yoyo: l = !1,
    to: d,
    onComplete: h
  } = {}) {
    if (!d)
      throw new Error("no destination provided");
    const u = new v(e).to(d, t).easing(B[s]).delay(o).repeat(a === -1 ? 1 / 0 : a).repeatDelay(r).yoyo(l);
    return n && u.start(), h && u.onComplete(h), this.tweens.push(u), this.group.add(u), u;
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
    const t = { value: 0 }, s = { value: 1 }, n = this.add(t, {
      time: e,
      easing: "linear",
      autostart: !0,
      to: s
    });
    return new Promise((o) => {
      n.onComplete(() => o());
    });
  }
  dummy(e) {
    const t = { value: 0 };
    return this.add(t, {
      ...e,
      easing: "linear",
      to: { value: 1 }
    });
  }
  fadeIn(e, t = {}) {
    e.alpha = 0;
    const { autostart: s, delay: n } = t, o = this.add(e, {
      ...t,
      to: { alpha: 1 }
    });
    return (s === !1 || n) && o.onStart(() => {
      e.alpha = 0;
    }), o;
  }
  fadeOut(e, t) {
    return this.add(e, {
      ...t,
      to: { alpha: 0 }
    });
  }
  zoomIn(e, t = { scaleFrom: 0.9 }) {
    const { scaleFrom: s } = t, n = e.scale.x || 1;
    return e.scale.x = s, e.scale.y = s, this.add(e.scale, {
      ...t,
      to: { x: n, y: n }
    });
  }
  zoomOut(e, t = { scaleTo: 1.1 }) {
    return this.add(e.scale, {
      ...t,
      to: { x: t.scaleTo, y: t.scaleTo }
    });
  }
  pulse(e, t = { scaleTo: 1.1 }) {
    const s = t.scaleTo, n = e.scale;
    return this.add(e.scale, {
      ...t,
      yoyo: !0,
      repeat: t?.repeat ?? 1,
      to: { x: n.x * s, y: n.y * s }
    });
  }
  fadeIn3(e, t) {
    if (!e.material) {
      let n;
      if (e.traverse((o) => {
        o instanceof p && (n = this.fadeIn3(o, t));
      }), !n)
        throw new Error("cannot create a tween, no nested mesh found");
      return n;
    }
    const s = e.material.opacity || 1;
    return e.material.transparent = !0, e.material.opacity = 0, this.add(e.material, {
      ...t,
      to: { opacity: s }
    });
  }
  fadeOut3(e, t) {
    if (!e.material) {
      let s;
      if (e.traverse((n) => {
        n instanceof p && (s = this.fadeOut3(n, t));
      }), !s)
        throw new Error("cannot create a tween, no nested mesh found");
      return s;
    }
    return e.material.transparent = !0, this.add(e.material, {
      ...t,
      to: { opacity: 0 }
    });
  }
  zoomIn3(e, t = { scaleFrom: 0.9 }) {
    const { x: s, y: n, z: o } = e.scale, { scaleFrom: a } = t;
    return e.scale.multiplyScalar(a), this.add(e.scale, {
      ...t,
      to: { x: s, y: n, z: o }
    });
  }
  zoomOut3(e, t = { scaleTo: 1.1 }) {
    const { scaleTo: s } = t;
    return this.add(e.scale, {
      ...t,
      to: { x: s, z: s, y: s }
    });
  }
  pulse3(e, t = { scaleTo: 1.1 }) {
    const { scaleTo: s } = t, n = e.scale;
    return this.add(e.scale, {
      ...t,
      easing: "cubic",
      yoyo: !0,
      to: { x: n.x * s, y: n.y * s, z: n.z * s }
    });
  }
  switchColor3(e, t, s) {
    const n = new m(e.material.color), o = new m(t), a = new m(), r = this.dummy({ ...s, easing: "sineIn" });
    return r.onUpdate((l) => {
      a.copy(n), a.lerp(o, l.value), e.material.color.setHex(a.getHex());
    }), r;
  }
}
const N = new q();
export {
  R as animations,
  U as events,
  W as htmlScreens,
  G as physics,
  H as pixiUI,
  N as tweens
};
