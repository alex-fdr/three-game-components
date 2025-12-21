import { LoopRepeat as v, LoopOnce as y, AnimationMixer as x, Mesh as f, Color as m } from "three";
import { assets as w, Signal as p } from "@alexfdr/three-game-core";
import * as I from "three/addons/utils/SkeletonUtils";
import { World as E, NaiveBroadphase as O } from "cannon-es";
import { WebGLRenderer as b, Container as T } from "pixi.js";
import { Easing as i, Group as S, Tween as g } from "@tweenjs/tween.js";
class C {
  mixers = /* @__PURE__ */ new Map();
  animationsList = [];
  enabled = !0;
  add(t, e, n = !1, s = 1) {
    const a = this.addMixer(t).clipAction(e);
    return a.timeScale = s, a.clampWhenFinished = !0, a.setLoop(n ? v : y, 1 / 0), this.animationsList.push(a), a;
  }
  addMixer(t) {
    this.mixers.has(t.uuid) || this.mixers.set(t.uuid, new x(t));
    const e = this.mixers.get(t.uuid);
    if (!e)
      throw new Error("no animation mixer found");
    return e;
  }
  onAnimationComplete(t, e, n = !0) {
    const s = t.getMixer(), o = () => {
      n && s.removeEventListener("finished", o), e?.();
    };
    s.addEventListener("finished", o);
  }
  update(t) {
    if (this.enabled)
      for (const [, e] of this.mixers)
        e.update(t);
  }
  parse(t) {
    const e = {
      mesh: null,
      anims: {},
      // animationsList: [],
      keys: []
    };
    for (const { key: n } of t) {
      const s = w.models.get(n);
      s.getObjectByProperty("type", "SkinnedMesh") && (e.mesh = I.clone(s));
    }
    if (!e.mesh)
      throw new Error("could not parse animations data, no base mesh found");
    for (const n of t) {
      const { key: s } = n, o = w.models.getAnimations(s);
      if (o.length) {
        const { name: a = s, loop: c = !1, timeScale: r = 1, clipId: h = 0 } = n, d = this.add(e.mesh, o[h], c, r);
        e.anims[a] = d, e.keys.push(a);
      }
    }
    return e;
  }
}
const A = new C();
class L {
  pool = {};
  on(t, e) {
    return this.has(t) || (this.pool[t] = []), this.pool[t].push(e), this;
  }
  once(t, e) {
    this.has(t) || (this.pool[t] = []);
    const n = this.pool[t].length;
    return this.pool[t].push((...s) => {
      e(...s), this.pool[t].splice(n, 1);
    }), this;
  }
  off(t) {
    return this.has(t) && delete this.pool[t], this;
  }
  emit(t, ...e) {
    if (this.has(t)) {
      const n = this.pool[t];
      for (const s of n)
        s(...e);
    }
    return this;
  }
  has(t) {
    return typeof this.pool[t] < "u";
  }
}
const D = new L();
class X {
  domElements = {};
  add(t) {
    const e = document.getElementById(t);
    if (!e)
      throw new Error(`no element with id=${t} found`);
    this.domElements[t] = e, e.addEventListener("animationend", () => {
      e.classList.contains("hiding") && e.classList.replace("hiding", "hidden");
    });
  }
  show(t) {
    this.getScreen(t).classList.replace("hidden", "shown");
  }
  hide(t) {
    this.getScreen(t).classList.replace("shown", "hiding");
  }
  getScreen(t) {
    const e = this.domElements[t];
    if (!e)
      throw new Error(`no screen with id=${t} found`);
    return e;
  }
}
const R = new X();
class Y {
  enabled = !1;
  handler = null;
  mouseEvents = ["mousedown", "mousemove", "mouseup"];
  touchEvents = ["touchstart", "touchmove", "touchend"];
  onDown = new p();
  onUp = new p();
  onMove = new p();
  init(t, e) {
    this.handler = e, this.enabled = !0;
    const s = "ontouchstart" in document.documentElement || navigator?.maxTouchPoints >= 1, [o, a, c] = s ? this.touchEvents : this.mouseEvents;
    t.addEventListener(o, (r) => {
      !this.enabled || !this.handler || (r instanceof TouchEvent && r?.touches?.length > 1 && r.preventDefault(), this.handler.down(this.getEvent(r)), this.onDown.dispatch(this.handler.status));
    }), t.addEventListener(a, (r) => {
      !this.enabled || !this.handler || !this.handler.pressed || (this.handler.move(this.getEvent(r)), this.onMove.dispatch(this.handler.status));
    }), t.addEventListener(c, (r) => {
      !this.enabled || !this.handler || (this.handler.up(this.getEvent(r)), this.onUp.dispatch(this.handler.status));
    });
  }
  toggle(t) {
    this.enabled = t;
  }
  getEvent(t) {
    return t instanceof TouchEvent ? t.changedTouches[0] : t;
  }
}
class H {
  pressed = !1;
  status = {
    currX: 0,
    currY: 0,
    prevX: 0,
    prevY: 0,
    deltaX: 0,
    deltaY: 0
  };
  down(t) {
    this.pressed = !0, this.status.currX = t.clientX, this.status.currY = t.clientY, this.status.prevX = this.status.currX, this.status.prevY = this.status.currY;
  }
  move(t) {
    this.pressed && (this.status.currX = t.clientX, this.status.currY = t.clientY, this.status.deltaX = this.status.currX - this.status.prevX, this.status.deltaY = this.status.currY - this.status.prevY);
  }
  up(t) {
    this.pressed = !1, this.status.deltaX = this.status.currX - this.status.prevX, this.status.deltaY = this.status.currY - this.status.prevY;
  }
}
const W = new Y();
class z {
  timeStep = 1 / 60;
  lastCallTime = 0;
  maxSubSteps = 3;
  world;
  constructor() {
    this.world = new E(), this.world.broadphase = new O();
  }
  init(t) {
    const { gravity: e = { x: 0, y: -10, z: 0 } } = t;
    this.world.gravity.set(e.x, e.y, e.z);
  }
  update(t) {
    if (!this.lastCallTime) {
      this.world.step(this.timeStep), this.lastCallTime = t;
      return;
    }
    const e = (t - this.lastCallTime) / 1e3;
    this.world.step(this.timeStep, e, this.maxSubSteps), this.lastCallTime = t;
  }
}
const G = new z();
class k {
  renderer = new b();
  stage = new T();
  screens = /* @__PURE__ */ new Map();
  async init(t, e, n) {
    const s = t.getContext();
    s && s instanceof WebGL2RenderingContext && (await this.renderer.init({
      context: s,
      width: e,
      height: n,
      clearBeforeRender: !1
    }), this.renderer.events.setTargetElement(t.domElement));
  }
  resize(t, e) {
    const s = 1 / (t / e), o = t > e ? "handleLandscape" : "handlePortrait";
    this.stage.position.set(t * 0.5, e * 0.5);
    for (const [, a] of this.screens)
      a[o](s);
    this.renderer.resize(t, e);
  }
  render() {
    this.renderer.resetState(), this.renderer.render({ container: this.stage });
  }
}
const N = new k(), B = {
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
  group = new S();
  add(t, {
    time: e = 300,
    easing: n = "sine",
    autostart: s = !0,
    delay: o = 0,
    repeat: a = 0,
    repeatDelay: c = 0,
    yoyo: r = !1,
    to: h,
    onComplete: d
  } = {}) {
    if (!h)
      throw new Error("no destination provided");
    const l = new g(t).to(h, e).easing(B[n]).delay(o).repeat(a === -1 ? 1 / 0 : a).repeatDelay(c).yoyo(r);
    return s && l.start(), d && l.onComplete(d), this.tweens.push(l), this.group.add(l), l;
  }
  remove(t) {
    this.group.remove(t), this.tweens.splice(this.tweens.indexOf(t), 1);
  }
  pause() {
    for (const t of this.tweens)
      t.pause();
  }
  resume() {
    for (const t of this.tweens)
      t.resume();
  }
  update(t) {
    this.group.update(t);
  }
  wait(t) {
    const e = { value: 0 }, n = { value: 1 }, s = this.add(e, {
      time: t,
      easing: "linear",
      autostart: !0,
      to: n
    });
    return new Promise((o) => {
      s.onComplete(() => o());
    });
  }
  dummy(t) {
    const e = { value: 0 };
    return this.add(e, {
      ...t,
      easing: "linear",
      to: { value: 1 }
    });
  }
  fadeIn(t, e = {}) {
    t.alpha = 0;
    const { autostart: n, delay: s } = e, o = this.add(t, {
      ...e,
      to: { alpha: 1 }
    });
    return (n === !1 || s) && o.onStart(() => {
      t.alpha = 0;
    }), o;
  }
  fadeOut(t, e) {
    return this.add(t, {
      ...e,
      to: { alpha: 0 }
    });
  }
  zoomIn(t, e = { scaleFrom: 0.9 }) {
    const { scaleFrom: n } = e, s = t.scale.x || 1;
    return t.scale.x = n, t.scale.y = n, this.add(t.scale, {
      ...e,
      to: { x: s, y: s }
    });
  }
  zoomOut(t, e = { scaleTo: 1.1 }) {
    return this.add(t.scale, {
      ...e,
      to: { x: e.scaleTo, y: e.scaleTo }
    });
  }
  pulse(t, e = { scaleTo: 1.1 }) {
    const n = e.scaleTo, s = t.scale;
    return this.add(t.scale, {
      ...e,
      yoyo: !0,
      repeat: e?.repeat ?? 1,
      to: { x: s.x * n, y: s.y * n }
    });
  }
  fadeIn3(t, e) {
    if (!t.material) {
      let s;
      if (t.traverse((o) => {
        o instanceof f && (s = this.fadeIn3(o, e));
      }), !s)
        throw new Error("cannot create a tween, no nested mesh found");
      return s;
    }
    const n = t.material.opacity || 1;
    return t.material.transparent = !0, t.material.opacity = 0, this.add(t.material, {
      ...e,
      to: { opacity: n }
    });
  }
  fadeOut3(t, e) {
    if (!t.material) {
      let n;
      if (t.traverse((s) => {
        s instanceof f && (n = this.fadeOut3(s, e));
      }), !n)
        throw new Error("cannot create a tween, no nested mesh found");
      return n;
    }
    return t.material.transparent = !0, this.add(t.material, {
      ...e,
      to: { opacity: 0 }
    });
  }
  zoomIn3(t, e = { scaleFrom: 0.9 }) {
    const { x: n, y: s, z: o } = t.scale, { scaleFrom: a } = e;
    return t.scale.multiplyScalar(a), this.add(t.scale, {
      ...e,
      to: { x: n, y: s, z: o }
    });
  }
  zoomOut3(t, e = { scaleTo: 1.1 }) {
    const { scaleTo: n } = e;
    return this.add(t.scale, {
      ...e,
      to: { x: n, z: n, y: n }
    });
  }
  pulse3(t, e = { scaleTo: 1.1 }) {
    const { scaleTo: n } = e, s = t.scale;
    return this.add(t.scale, {
      ...e,
      easing: "cubic",
      yoyo: !0,
      to: { x: s.x * n, y: s.y * n, z: s.z * n }
    });
  }
  switchColor3(t, e, n) {
    const s = new m(t.material.color), o = new m(e), a = new m(), c = this.dummy({ ...n, easing: "sineIn" });
    return c.onUpdate((r) => {
      a.copy(s), a.lerp(o, r.value), t.material.color.setHex(a.getHex());
    }), c;
  }
}
const $ = new q();
export {
  H as DragHandler,
  A as animations,
  D as events,
  R as htmlScreens,
  W as input,
  G as physics,
  N as pixiUI,
  $ as tweens
};
