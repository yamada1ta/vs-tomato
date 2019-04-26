import { Graphics, Container, Text } from 'pixi.js'
import { Tween } from '@tweenjs/tween.js'
import { Consts } from './consts'
import { setParent } from './utils';
import { Range } from './range'
import { Tomato } from './tomato';

export class GuideLabel {
  public readonly hitRangeLeft: Range;
  public readonly hitRangeRight: Range;

  private readonly root = new Container();
  private readonly leftGuide = new Container();
  private readonly rightGuide = new Container();

  constructor(screenSize: Range) {
    const leftBack = new Graphics()
      .beginFill(Consts.Color.lightGreen)
      .drawRect(0, 0, screenSize.width / 2 - 40, screenSize.height * 0.2)
      .endFill();
    leftBack.alpha = 0.7;
    leftBack.x = 20;
    leftBack.y = 10;

    const leftText1 = new Text('W', Consts.baseStyle);
    leftText1.x = (leftBack.width - leftText1.width) / 2;
    leftText1.y = 7;

    const leftText2 = new Text('A', Consts.baseStyle);
    leftText2.x = (leftBack.width - leftText1.width) / 2 - 25;
    leftText2.y = leftText1.y + leftText1.height - 1;

    const leftText3 = new Text('D', Consts.baseStyle);
    leftText3.x = (leftBack.width - leftText1.width) / 2 + 32;
    leftText3.y = leftText2.y;

    const leftText4 = new Text('S', Consts.baseStyle);
    leftText4.x = (leftBack.width - leftText1.width) / 2 + 5;
    leftText4.y = leftText2.y + leftText2.height;

    const leftText = new Container();
    leftText.x = leftBack.x;
    leftText.y = leftBack.y;
    leftText.addChild(leftText1, leftText2, leftText3, leftText4);

    const leftTomato = new Tomato(Consts.Color.red);
    leftTomato.x = screenSize.width / 4;
    leftTomato.y = screenSize.height / 2 - 30;
    this.hitRangeLeft = leftTomato.hitRange;

    const leftTomatoText = new PIXI.Text('START', Consts.baseStyle);
    leftTomatoText.x = leftTomato.x - 21;
    leftTomatoText.y = leftTomato.y - 37;
    leftTomatoText.style.fontSize = 16;
    leftTomatoText.style.fill = Consts.Color.red;

    this.leftGuide.addChild(leftBack);
    this.leftGuide.addChild(leftText);
    this.leftGuide.addChild(leftTomatoText);
    leftTomato.parent = this.leftGuide;

    this.root.addChild(this.leftGuide);

    const rightBack = new Graphics()
      .beginFill(Consts.Color.lightGreen)
      .drawRect(0, 0, screenSize.width / 2 - 40, screenSize.height * 0.2)
      .endFill();
    rightBack.alpha = 0.7;
    rightBack.x = screenSize.width - rightBack.width - 20;
    rightBack.y = 10;

    const rightText = new Text('Move Mouse', Consts.baseStyle);
    rightText.style.fontSize = 24;
    rightText.x = rightBack.x + (rightBack.width - rightText.width) / 2;
    rightText.y = rightBack.y + (rightBack.height - rightText.height) / 2;

    const rightTomato = new Tomato(Consts.Color.red);
    rightTomato.x = screenSize.width / 4 * 3;
    rightTomato.y = leftTomato.y;
    this.hitRangeRight = rightTomato.hitRange;

    const rightTomatoText = new PIXI.Text('START', Consts.baseStyle);
    rightTomatoText.x = rightTomato.x - 21;
    rightTomatoText.y = rightTomato.y - 37;
    rightTomatoText.style.fontSize = 16;
    rightTomatoText.style.fill = Consts.Color.red;

    this.rightGuide.addChild(rightBack);
    this.rightGuide.addChild(rightText, rightTomatoText);
    rightTomato.parent = this.rightGuide;
    this.root.addChild(this.rightGuide);
  }

  set parent(value: Container | null) {
    setParent(this.root, value);
  }

  hideLeft() {
    new Tween(this.leftGuide)
      .to({ alpha: 0 }, 100)
      .start();
  }

  hideRight() {
    new Tween(this.rightGuide)
      .to({ alpha: 0 }, 100)
      .start();
  }
}