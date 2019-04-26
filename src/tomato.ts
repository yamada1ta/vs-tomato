import { Sprite, Container } from 'pixi.js'
import { Consts } from './consts'
import { Tween } from '@tweenjs/tween.js'
import { setParent, randInt } from './utils';

export class Tomato {
  private readonly graphics: Sprite;

  constructor(color?: number) {
    this.graphics = Sprite.fromImage(Consts.Resource.tomato);
    this.graphics.anchor.set(0.5);
    this.graphics.width = 32;
    this.graphics.height = 26;
    this.graphics.tint = color ? color : randomColor();
  }

  get x() { return this.graphics.x; }
  set x(value: number) { this.graphics.x = value; }

  get y() { return this.graphics.y; }
  set y(value: number) { this.graphics.y = value; }

  get width() { return this.graphics.width; }
  get height() { return this.graphics.height; }

  get hitRange() {
    return {
      x: this.graphics.x, y: this.graphics.y,
      width: this.graphics.width, height: this.graphics.height
    };
  }

  set parent(value: Container | null) {
    setParent(this.graphics, value);
  }

  startAnimation() {
    return new Tween(this.graphics);
  }

  remove() {
    this.startAnimation()
      .to({ alpha: 0 }, 200)
      .onComplete(() => this.parent = null)
      .start();
  }
}

function randomColor() {
  const hue = randInt(0, 9) === 0 ? randInt(30, 90) : randInt(0, 15);
  return RGBToHex(HSVToRGB(hue, 0.7, 0.9));
}

function HSVToRGB(H: number, S: number, V: number) {
  const C = V * S;
  const Hp = H / 60;
  const X = C * (1 - Math.abs(Hp % 2 - 1));

  let R = 0;
  let G = 0;
  let B = 0;

  if (0 <= Hp && Hp < 1) { [R, G, B] = [C, X, 0] };
  if (1 <= Hp && Hp < 2) { [R, G, B] = [X, C, 0] };
  if (2 <= Hp && Hp < 3) { [R, G, B] = [0, C, X] };
  if (3 <= Hp && Hp < 4) { [R, G, B] = [0, X, C] };
  if (4 <= Hp && Hp < 5) { [R, G, B] = [X, 0, C] };
  if (5 <= Hp && Hp < 6) { [R, G, B] = [C, 0, X] };

  const m = V - C;
  [R, G, B] = [R + m, G + m, B + m];

  R = Math.floor(R * 255);
  G = Math.floor(G * 255);
  B = Math.floor(B * 255);

  return [R, G, B];
}

function RGBToHex(rgb: number[]) {
  return Number('0x' + rgb.map(value => ('0' + value.toString(16)).slice(-2)).join(''));
}