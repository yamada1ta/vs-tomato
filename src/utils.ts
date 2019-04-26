import { DisplayObject, Container } from 'pixi.js'
import { Range } from './range'

export function hit(a: Range, b: Range) {
  return Math.abs(a.x - b.x) < a.width / 2 + b.width / 2 &&
    Math.abs(a.y - b.y) < a.height / 2 + b.height / 2;
}

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

export function setParent(child: DisplayObject, parent: Container | null) {
  if (parent !== null) {
    parent.addChild(child);
  } else if (child.parent) {
    child.parent.removeChild(child);
  }
}

export function rangeInt(min: number, max: number) {
  const result: number[] = [];

  for (let i = min; i <= max; i++) {
    result.push(i)
  }

  return result;
}