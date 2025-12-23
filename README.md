This package contains a bunch of components to help with the development of three.js based projects

[![npm version](https://img.shields.io/npm/v/@alexfdr/three-game-components)](https://www.npmjs.com/package/@alexfdr/three-game-components)

# List of components 

- animations
- tweens
- physics
- input
- events
- pixi-ui

## Animations Component
This is a wrapper around three.js animation system. Animations can be created manually by calling `add` method or by providing a config to the `parse` method.

```javascript
import { animations } from '@alexfdr/three-game-components';

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
This component is based on tween.js library, makes tween's creation, deletion and update simple and unified.

```javascript
import { tweens } from '@alexfdr/three-game-components';

const tweenedObject = { x: 10, y: 20 };
const timeMs = 500;

tweens.add(tweenedObject, timeMs, {
    to: { x: 0, y: 0 }, 
    easing: 'sine', 
    repeat: Infinity 
});
```

## Physics Component
This is a slim wrapper around cannon-es lib, it just sets up the physics world and provides an update method that should be called inside user defined game loop.

```javascript
import { Body, Box, Vec3 } from 'cannon-es';
import { physics } from '@alexfdr/three-game-components';

// create static body
const body = new Body({ mass: 0 });
const shape = new Box(new Vec3(1, 1, 1));
body.addShape(shape);
body.position.set(0, 0, 0);

physics.world.addBody(body);
```

## Events Component
This component allows to subscribe to events and emit those events later on.

```javascript
import { events } from '@alexfdr/three-game-components;

events.on('some-event', (...args) => {
    // do something when event fired
});

events.emit('some-event');
```

## Input Component
Basic input handling component.

```typescript
import { input, DragHandler } from '@alexfdr/three-game-components';

input.init(renderer.domElement, new DragHandler());
```