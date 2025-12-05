import { Easing } from '@tweenjs/tween.js';

export const mapping = {
    linear: Easing.Linear.None,

    quad: Easing.Quadratic.InOut,
    quadIn: Easing.Quadratic.In,
    quadOut: Easing.Quadratic.Out,

    cubic: Easing.Cubic.InOut,
    cubicIn: Easing.Cubic.In,
    cubicOut: Easing.Cubic.Out,

    quar: Easing.Quartic.InOut,
    quarIn: Easing.Quartic.In,
    quarOut: Easing.Quartic.Out,

    quint: Easing.Quintic.InOut,
    quintIn: Easing.Quintic.In,
    quintOut: Easing.Quintic.Out,

    sine: Easing.Sinusoidal.InOut,
    sineIn: Easing.Sinusoidal.In,
    sineOut: Easing.Sinusoidal.Out,

    exp: Easing.Exponential.InOut,
    expIn: Easing.Exponential.In,
    expOut: Easing.Exponential.Out,

    circ: Easing.Circular.InOut,
    circIn: Easing.Circular.In,
    circOut: Easing.Circular.Out,

    elastic: Easing.Elastic.InOut,
    elasticIn: Easing.Elastic.In,
    elasticOut: Easing.Elastic.Out,

    back: Easing.Back.InOut,
    backIn: Easing.Back.In,
    backOut: Easing.Back.Out,

    bounce: Easing.Bounce.InOut,
    bounceIn: Easing.Bounce.In,
    bounceOut: Easing.Bounce.Out,
};