import { Sprite, Container, Point } from 'pixi.js'
import { Consts } from './consts'
import { Range, limitPos } from './range';

export class Fork {
  private readonly graphics: Sprite;

  constructor(x: number, y: number) {
    this.graphics = Sprite.fromImage(Consts.Resource.fork);
    this.graphics.anchor.set(0.5);
    this.graphics.width = 28;
    this.graphics.height = 128;
    this.graphics.tint = Consts.Color.gold;
    this.graphics.x = x;
    this.graphics.y = y;
  }

  move(pos: Point, range: Range) {
    this.graphics.position = pos;
    limitPos(this.graphics, range);
  }

  set parent(value: Container) {
    value.addChild(this.graphics);
  }

  get hitRange() {
    return {
      x: this.graphics.x, y: this.graphics.y,
      width: this.graphics.width, height: this.graphics.height
    };
  }
}