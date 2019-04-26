import { Sprite, Container } from 'pixi.js'
import { Consts } from './consts'
import { Range, limitPos } from './range';

export class Spoon {
  private readonly graphics: Sprite;

  constructor(x: number, y: number) {
    this.graphics = Sprite.fromImage(Consts.Resource.spoon);
    this.graphics.anchor.set(0.5);
    this.graphics.width = 30;
    this.graphics.height = 128;
    this.graphics.tint = Consts.Color.silver;
    this.graphics.x = x;
    this.graphics.y = y;
  }

  set parent(value: Container) {
    value.addChild(this.graphics);
  }

  move(pressedKeys: string[], range: Range) {
    const velocity = 10;

    if (pressedKeys.indexOf('w') !== -1) {
      this.graphics.y -= velocity;
    }
    if (pressedKeys.indexOf('a') !== -1) {
      this.graphics.x -= velocity;
    }
    if (pressedKeys.indexOf('s') !== -1) {
      this.graphics.y += velocity;
    }
    if (pressedKeys.indexOf('d') !== -1) {
      this.graphics.x += velocity;
    }

    limitPos(this.graphics, range);
  }

  get hitRange() {
    return {
      x: this.graphics.x, y: this.graphics.y,
      width: this.graphics.width, height: this.graphics.height
    };
  }
}