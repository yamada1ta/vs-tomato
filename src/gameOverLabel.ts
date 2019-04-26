import { Graphics, Container, Text, Rectangle } from 'pixi.js'
import { Consts } from './consts'
import { setParent } from './utils';
import { Range } from './range'
import { Tween } from '@tweenjs/tween.js'

export class GameOverLabel {
  onClick = () => { };

  private readonly root = new Container();
  private readonly back: Graphics;
  private readonly mainText: Text;
  private readonly retryText: Text;

  constructor(screenSize: Range) {
    this.mainText = new Text("Can't Eat Anymore...", Consts.baseStyle);
    this.mainText.style.fontSize = 36;
    this.mainText.x = (screenSize.width - this.mainText.width) / 2;
    this.mainText.y = 30;

    this.retryText = new Text('Click Retry', Consts.baseStyle);
    this.retryText.style.fontSize = 22;
    this.retryText.x = (screenSize.width - this.retryText.width) / 2;
    this.retryText.y = 100;
    this.retryText.alpha = 0;

    this.back = new Graphics()
      .beginFill(Consts.Color.lightGreen)
      .drawRect(0, 0, screenSize.width, screenSize.height * 0.3)
      .endFill();
    this.back.y = 0;
    this.back.alpha = 0.8;

    this.root.addChild(this.back);
    this.root.addChild(this.mainText);
    this.root.addChild(this.retryText);

    this.root.x = (screenSize.width - this.root.width) / 2;
    this.root.y = (screenSize.height - this.root.height) / 2;
    this.root.alpha = 0;
    this.root.hitArea = new Rectangle(0, 0, screenSize.width, screenSize.height);
    this.root.on('pointertap', () => {
      this.onClick();
    });
  }

  set parent(value: Container | null) {
    setParent(this.root, value);
  }

  show() {
    new Tween(this.root)
      .to({ alpha: 1 }, 300)
      .delay(500)
      .onComplete(() => {
        new Tween(this.retryText)
          .to({ alpha: 1 }, 300)
          .delay(300)
          .onComplete(() => this.root.interactive = true)
          .start();
      })
      .start();
  }

  hide() {
    new Tween(this.root)
      .to({ alpha: 0 }, 100)
      .onComplete(() => {
        this.retryText.alpha = 0;
        this.root.interactive = false;
      })
      .start();
  }
}