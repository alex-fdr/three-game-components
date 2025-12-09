This package contains a bunch of components to help with the development of three.js based projects

# List of components 

- animations
- tweens
- physics

## Animations Component
A wrapper around three.js animation's system. Animations can be created manually by calling `add` method or by providing a config to the `parse` method.

```javascript
import { animations } from '@alexfdr/three-game-components/animations';

animations.parse([
    {
        key: 'character-idle',
        name: 'idle',
        loop: true,
        timeScale: 1,
    },
    {
        key: 'animation-dance',
        name: 'dance',
        loop: true,
        timeScale: 1,
    },
]);
```

## Tweens Component
A component is based on tween.js library, makes tween's creation, deletion and update simple and unified.

```javascript
import { tweens } from '@alexfdr/three-game-components/tweens';

const tweenedObject = { x: 10, y: 20 };
const timeMs = 500;

tweens.add(tweenedObject, timeMs, {
    to: { x: 0, y: 0 }, 
    easing: 'sine', 
    repeat: Infinity 
});
```

## Physics Component
A slim wrapper around cannon-es lib, it just sets up the physics world and provides an update method that should be called inside user defined game loop.

```javascript
import { Body, Box, Vec3 } from 'cannon-es';
import { physics } from '@alexfdr/three-game-components/physics';

// create static body
const body = new Body({ mass: 0 });
const shape = new Box(new Vec3(1, 1, 1));
body.addShape(shape);
body.position.set(0, 0, 0);

physics.world.addBody(body);
```