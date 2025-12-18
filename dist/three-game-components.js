import { LoopRepeat as w, LoopOnce as y, AnimationMixer as x, Mesh as f, Color as h } from "three";
import { assets as p } from "@alexfdr/three-game-core";
import * as I from "three/addons/utils/SkeletonUtils";
import { World as O, NaiveBroadphase as S } from "cannon-es";
import { WebGLRenderer as b, Container as C } from "pixi.js";
import { Easing as i, Group as E, Tween as T } from "@tweenjs/tween.js";
class v {
  mixers = /* @__PURE__ */ new Map();
  animationsList = [];
  enabled = !0;
  add(e, t, s = !1, n = 1) {
    const o = this.addMixer(e).clipAction(t);
    return o.timeScale = n, o.clampWhenFinished = !0, o.setLoop(s ? w : y, 1 / 0), this.animationsList.push(o), o;
  }
  addMixer(e) {
    this.mixers.has(e.uuid) || this.mixers.set(e.uuid, new x(e));
    const t = this.mixers.get(e.uuid);
    if (!t)
      throw new Error("no animation mixer found");
    return t;
  }
  onAnimationComplete(e, t, s = !0) {
    const n = e.getMixer(), a = () => {
      s && n.removeEventListener("finished", a), t?.();
    };
    n.addEventListener("finished", a);
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
      const n = p.models.get(s);
      n.getObjectByProperty("type", "SkinnedMesh") && (t.mesh = I.clone(n));
    }
    if (!t.mesh)
      throw new Error("could not parse animations data, no base mesh found");
    for (const s of e) {
      const { key: n } = s, a = p.models.getAnimations(n);
      if (a.length) {
        const { name: o = n, loop: r = !1, timeScale: c = 1, clipId: d = 0 } = s, m = this.add(t.mesh, a[d], r, c);
        t.anims[o] = m, t.keys.push(o);
      }
    }
    return t;
  }
}
const A = new v();
class L {
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
const P = new L();
class z {
  timeStep = 1 / 60;
  lastCallTime = 0;
  maxSubSteps = 3;
  world;
  constructor() {
    this.world = new O(), this.world.broadphase = new S();
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
const U = new z();
class k {
  renderer = new b();
  stage = new C();
  screens = /* @__PURE__ */ new Map();
  async init(e, t, s) {
    const n = e.getContext();
    n && n instanceof WebGL2RenderingContext && await this.renderer.init({
      context: n,
      width: t,
      height: s,
      clearBeforeRender: !1
    });
  }
  resize(e, t) {
    const n = 1 / (e / t), a = e > t ? "handleLandscape" : "handlePortrait";
    this.stage.position.set(e * 0.5, t * 0.5);
    for (const [, o] of this.screens)
      o[a](n);
    this.renderer.resize(e, t);
  }
  render() {
    this.renderer.resetState(), this.renderer.render(this.stage);
  }
}
const W = new k(), B = {
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
class g {
  tweens = [];
  group = new E();
  add(e, {
    time: t = 300,
    easing: s = "sine",
    autostart: n = !0,
    delay: a = 0,
    repeat: o = 0,
    repeatDelay: r = 0,
    yoyo: c = !1,
    to: d,
    onComplete: m
  } = {}) {
    if (!d)
      throw new Error("no destination provided");
    const l = new T(e).to(d, t).easing(B[s]).delay(a).repeat(o === -1 ? 1 / 0 : o).repeatDelay(r).yoyo(c);
    return n && l.start(), m && l.onComplete(m), this.tweens.push(l), this.group.add(l), l;
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
    return new Promise((a) => {
      n.onComplete(() => a());
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
    const { autostart: s, delay: n } = t, a = this.add(e, {
      ...t,
      to: { alpha: 1 }
    });
    return (s === !1 || n) && a.onStart(() => {
      e.alpha = 0;
    }), a;
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
      if (e.traverse((a) => {
        a instanceof f && (n = this.fadeIn3(a, t));
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
        n instanceof f && (s = this.fadeOut3(n, t));
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
    const { x: s, y: n, z: a } = e.scale, { scaleFrom: o } = t;
    return e.scale.multiplyScalar(o), this.add(e.scale, {
      ...t,
      to: { x: s, y: n, z: a }
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
    const n = new h(e.material.color), a = new h(t), o = new h(), r = this.dummy({ ...s, easing: "sineIn" });
    return r.onUpdate((c) => {
      o.copy(n), o.lerp(a, c.value), e.material.color.setHex(o.getHex());
    }), r;
  }
}
const G = new g();
export {
  A as animations,
  P as htmlScreens,
  U as physics,
  W as pixiUI,
  G as tweens
};
