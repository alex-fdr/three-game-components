var w = Object.defineProperty;
var f = (c, e, t) => e in c ? w(c, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[e] = t;
var I = (c, e, t) => f(c, typeof e != "symbol" ? e + "" : e, t);
import { Easing as a, Group as p, Tween as y } from "@tweenjs/tween.js";
import { Mesh as m, Color as O } from "three";
const x = {
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
class b {
  constructor() {
    I(this, "tweens", []);
    I(this, "group", new p());
  }
  add(e, t = 300, {
    easing: n = "sine",
    autostart: u = !0,
    delay: i = 0,
    repeat: o = 0,
    repeatDelay: s = 0,
    yoyo: l = !1,
    to: d,
    onComplete: h
  } = {}) {
    if (!d)
      throw new Error("no destination provided");
    const r = new y(e).to(d, t).easing(x[n]).delay(i).repeat(o === -1 ? 1 / 0 : o).repeatDelay(s).yoyo(l);
    return u && r.start(), h && r.onComplete(h), this.tweens.push(r), this.group.add(r), r;
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
    const t = { value: 0 }, n = { value: 1 }, u = this.add(t, e, {
      easing: "linear",
      autostart: !0,
      to: n
    });
    return new Promise((i) => {
      u.onComplete(() => i());
    });
  }
  dummy(e, t) {
    return this.add({ value: 0 }, e, {
      ...t,
      easing: "linear",
      to: { value: 1 }
    });
  }
  fadeIn(e, t = 300, n) {
    e.alpha = 0;
    const u = this.add(e, t, {
      ...n,
      to: { alpha: 1 }
    });
    return (n.autostart === !1 || n.delay) && u.onStart(() => {
      e.alpha = 0;
    }), u;
  }
  fadeOut(e, t = 200, n) {
    return this.add(e, t, {
      ...n,
      to: { alpha: 0 }
    });
  }
  zoomIn(e, t = 0, n = 300, u) {
    const i = e.scale.x || 1;
    return e.scale.x = t, e.scale.y = t, this.add(e.scale, n, {
      ...u,
      to: { x: i, y: i }
    });
  }
  zoomOut(e, t = 0, n = 300, u = {}) {
    return this.add(e.scale, n, {
      ...u,
      to: { x: t, y: t }
    });
  }
  pulse(e, t = 300, n) {
    const u = n.scaleTo || 1.1, i = e.scale;
    return this.add(e.scale, t, {
      ...n,
      yoyo: !0,
      repeat: n.repeat || 1,
      to: { x: i.x * u, y: i.y * u }
    });
  }
  fadeIn3(e, t, n) {
    if (!e.material) {
      let i;
      if (e.traverse((o) => {
        o instanceof m && (i = this.fadeIn3(o, t, n));
      }), !i)
        throw new Error("cannot create a tween, no nested mesh found");
      return i;
    }
    const u = e.material.opacity || 1;
    return e.material.transparent = !0, e.material.opacity = 0, this.add(e.material, t, {
      ...n,
      to: { opacity: u }
    });
  }
  fadeOut3(e, t, n) {
    if (!e.material) {
      let u;
      if (e.traverse((i) => {
        i instanceof m && (u = this.fadeOut3(i, t, n));
      }), !u)
        throw new Error("cannot create a tween, no nested mesh found");
      return u;
    }
    return e.material.transparent = !0, this.add(e.material, t, {
      ...n,
      to: { opacity: 0 }
    });
  }
  zoomIn3(e, t, n) {
    const { x: u, y: i, z: o } = e.scale, s = n.scaleFrom;
    return e.scale.multiplyScalar(s), this.add(e.scale, t, {
      ...n,
      to: { x: u, y: i, z: o }
    });
  }
  pulse3(e, t = 300, n) {
    const u = n.scaleTo || 1.1, i = e.scale;
    return this.add(e.scale, t, {
      ...n,
      easing: "cubic",
      yoyo: !0,
      to: { x: i.x * u, y: i.y * u, z: i.z * u }
    });
  }
  switchColor3(e, t, n, u) {
    const i = new O(e.material.color), o = new O(t), s = new O(), l = this.dummy(n, { ...u, easing: "sineIn" });
    return l.onUpdate((d) => {
      s.copy(i), s.lerp(o, d.value), e.material.color.setHex(s.getHex());
    }), l;
  }
}
const C = new b();
C.add({ alpha: 1 }, 500, {
  to: { alpha: 1 }
});
export {
  C as tweens
};
