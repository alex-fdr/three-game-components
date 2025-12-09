import { Easing as n, Group as m, Tween as w } from "@tweenjs/tween.js";
import { Mesh as O, Color as d } from "three";
const f = {
  linear: n.Linear.None,
  quad: n.Quadratic.InOut,
  quadIn: n.Quadratic.In,
  quadOut: n.Quadratic.Out,
  cubic: n.Cubic.InOut,
  cubicIn: n.Cubic.In,
  cubicOut: n.Cubic.Out,
  quar: n.Quartic.InOut,
  quarIn: n.Quartic.In,
  quarOut: n.Quartic.Out,
  quint: n.Quintic.InOut,
  quintIn: n.Quintic.In,
  quintOut: n.Quintic.Out,
  sine: n.Sinusoidal.InOut,
  sineIn: n.Sinusoidal.In,
  sineOut: n.Sinusoidal.Out,
  exp: n.Exponential.InOut,
  expIn: n.Exponential.In,
  expOut: n.Exponential.Out,
  circ: n.Circular.InOut,
  circIn: n.Circular.In,
  circOut: n.Circular.Out,
  elastic: n.Elastic.InOut,
  elasticIn: n.Elastic.In,
  elasticOut: n.Elastic.Out,
  back: n.Back.InOut,
  backIn: n.Back.In,
  backOut: n.Back.Out,
  bounce: n.Bounce.InOut,
  bounceIn: n.Bounce.In,
  bounceOut: n.Bounce.Out
};
class h {
  tweens = [];
  group = new m();
  add(e, a = 300, {
    easing: t = "sine",
    autostart: u = !0,
    delay: i = 0,
    repeat: o = 0,
    repeatDelay: s = 0,
    yoyo: r = !1,
    to: l,
    onComplete: I
  } = {}) {
    if (!l)
      throw new Error("no destination provided");
    const c = new w(e).to(l, a).easing(f[t]).delay(i).repeat(o === -1 ? 1 / 0 : o).repeatDelay(s).yoyo(r);
    return u && c.start(), I && c.onComplete(I), this.tweens.push(c), this.group.add(c), c;
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
    const a = { value: 0 }, t = { value: 1 }, u = this.add(a, e, {
      easing: "linear",
      autostart: !0,
      to: t
    });
    return new Promise((i) => {
      u.onComplete(() => i());
    });
  }
  dummy(e, a) {
    return this.add({ value: 0 }, e, {
      ...a,
      easing: "linear",
      to: { value: 1 }
    });
  }
  fadeIn(e, a = 300, t) {
    e.alpha = 0;
    const u = this.add(e, a, {
      ...t,
      to: { alpha: 1 }
    });
    return (t.autostart === !1 || t.delay) && u.onStart(() => {
      e.alpha = 0;
    }), u;
  }
  fadeOut(e, a = 200, t) {
    return this.add(e, a, {
      ...t,
      to: { alpha: 0 }
    });
  }
  zoomIn(e, a = 0, t = 300, u) {
    const i = e.scale.x || 1;
    return e.scale.x = a, e.scale.y = a, this.add(e.scale, t, {
      ...u,
      to: { x: i, y: i }
    });
  }
  zoomOut(e, a = 0, t = 300, u = {}) {
    return this.add(e.scale, t, {
      ...u,
      to: { x: a, y: a }
    });
  }
  pulse(e, a = 300, t) {
    const u = t.scaleTo || 1.1, i = e.scale;
    return this.add(e.scale, a, {
      ...t,
      yoyo: !0,
      repeat: t.repeat || 1,
      to: { x: i.x * u, y: i.y * u }
    });
  }
  fadeIn3(e, a, t) {
    if (!e.material) {
      let i;
      if (e.traverse((o) => {
        o instanceof O && (i = this.fadeIn3(o, a, t));
      }), !i)
        throw new Error("cannot create a tween, no nested mesh found");
      return i;
    }
    const u = e.material.opacity || 1;
    return e.material.transparent = !0, e.material.opacity = 0, this.add(e.material, a, {
      ...t,
      to: { opacity: u }
    });
  }
  fadeOut3(e, a, t) {
    if (!e.material) {
      let u;
      if (e.traverse((i) => {
        i instanceof O && (u = this.fadeOut3(i, a, t));
      }), !u)
        throw new Error("cannot create a tween, no nested mesh found");
      return u;
    }
    return e.material.transparent = !0, this.add(e.material, a, {
      ...t,
      to: { opacity: 0 }
    });
  }
  zoomIn3(e, a, t) {
    const { x: u, y: i, z: o } = e.scale, s = t.scaleFrom;
    return e.scale.multiplyScalar(s), this.add(e.scale, a, {
      ...t,
      to: { x: u, y: i, z: o }
    });
  }
  pulse3(e, a = 300, t) {
    const u = t.scaleTo || 1.1, i = e.scale;
    return this.add(e.scale, a, {
      ...t,
      easing: "cubic",
      yoyo: !0,
      to: { x: i.x * u, y: i.y * u, z: i.z * u }
    });
  }
  switchColor3(e, a, t, u) {
    const i = new d(e.material.color), o = new d(a), s = new d(), r = this.dummy(t, { ...u, easing: "sineIn" });
    return r.onUpdate((l) => {
      s.copy(i), s.lerp(o, l.value), e.material.color.setHex(s.getHex());
    }), r;
  }
}
const b = new h();
export {
  b as tweens
};
