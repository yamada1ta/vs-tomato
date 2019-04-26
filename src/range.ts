import { Sprite } from 'pixi.js'

export type Range = { x: number, y: number, width: number, height: number };

export function limitPos(target: Sprite, range: Range) {
  const xMin = range.x + target.width * target.anchor.x;
  const xMax = range.x + range.width - target.width * (1 - target.anchor.x);
  target.x = target.x < xMin ? xMin : target.x;
  target.x = target.x > xMax ? xMax : target.x;

  const yMin = range.y + target.height * target.anchor.y;
  const yMax = range.y + range.height - target.height * (1 - target.anchor.y);
  target.y = target.y < yMin ? yMin : target.y;
  target.y = target.y > yMax ? yMax : target.y;
}
