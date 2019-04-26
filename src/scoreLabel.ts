import { Graphics, Container, Text } from 'pixi.js'
import { Consts } from './consts'
import { setParent } from './utils';
import { Tween } from '@tweenjs/tween.js';

export class ScoreLabel {
  private readonly root = new Container();
  private readonly back: Graphics;
  private readonly text: Text;

  constructor(score: number = 0) {
    this.back = new Graphics();
    this.back.y = 8;
    this.back.alpha = 0.8;
    this.root.addChild(this.back);

    this.text = new Text(score.toString(), Consts.baseStyle);
    this.text.x = 12;
    this.text.y = 10;
    this.root.addChild(this.text);

    this.adjustBack();

    this.root.alpha = 0;
  }

  set score(value: number) {
    const prevLength = this.text.text.length;
    this.text.text = value.toString();

    if (this.text.text.length !== prevLength) {
      this.adjustBack();
    }
  }

  set parent(value: Container | null) {
    setParent(this.root, value);
  }

  show() {
    new Tween(this.root)
      .to({ alpha: 1 }, 200)
      .start();
  }

  private adjustBack() {
    this.back
      .clear()
      .beginFill(Consts.Color.lightGreen)
      .drawRoundedRect(-10, 0, 35 + this.text.width, 35, 10)
      .endFill();
  }
}