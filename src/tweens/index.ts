import { TweensFactory } from './tweens';

export const tweens = new TweensFactory();

tweens.add({ alpha: 1 }, 500, { 
    to: { alpha: 1}
})