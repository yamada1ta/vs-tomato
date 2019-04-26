import { Application, Container, Graphics, Rectangle } from 'pixi.js'
import * as TWEEN from '@tweenjs/tween.js'
import { Range } from './range'
import { Spoon } from './spoon'
import { Fork } from './fork';
import { Tomato } from './tomato';
import { ScoreLabel } from './scoreLabel';
import { GameOverLabel } from './gameOverLabel';
import { GuideLabel } from './guideLabel';
import { randInt, rangeInt, hit } from './utils';
import { Consts } from './consts';

const app = new Application({
  width: 500,
  height: 500,
  antialias: true,
  backgroundColor: Consts.Color.lightYellow
});

const leftRect = { x: 0, y: 0, width: app.screen.width / 2, height: app.screen.height };
const rightRect = { x: app.screen.width / 2, y: 0, width: app.screen.width / 2, height: app.screen.height };

let score = 0;
let counter = 0;
let prevSpawn: number[] = [];
let pressedKeys: string[] = [];
let tomatoAnims: TWEEN.Tween[] = [];

enum GameState { Guide, Play, GameOver };
let state = GameState.Guide;
let leftGuideEnd = false;
let rightGuideEnd = false;

const sameMax = 2;
const speeds = [0.25, 0.3, 0.35, 0.4];
const intervals = rangeInt(4, 10)
  .map(v => v * 5)
  .reverse()
  .concat(rangeInt(0, 4).map(v => v * 2 + 10).reverse());
intervals.push(8, 7);

function gameLevel() {
  const borders = [0, 2, 5, 8, 11, 20, 35, 50, 75, 100, 150, 200, 300, 500];

  for (let i = borders.length - 1; i >= 0; i--) {
    if (score >= borders[i]) {
      return i;
    }
  }

  return 0;
}

const tomatoes = new Container();
app.stage.addChild(tomatoes);

const spoon = new Spoon(app.screen.width / 4, app.screen.height * 3 / 4);
spoon.parent = app.stage;

const fork = new Fork(app.screen.width * 3 / 4, app.screen.height * 3 / 4);
fork.parent = app.stage;

const line = new Graphics()
  .lineStyle(1, Consts.Color.lightGreen)
  .moveTo(0, 0)
  .lineTo(0, app.screen.height);
line.x = (app.screen.width - line.width) / 2;
app.stage.addChild(line);

const scoreLabel = new ScoreLabel();
scoreLabel.parent = app.stage;

const gameOverLabel = new GameOverLabel(app.screen);
gameOverLabel.parent = app.stage;
gameOverLabel.onClick = retry;

const guideLabel = new GuideLabel(app.screen);
guideLabel.parent = app.stage;

function spawnTomato(range: Range) {
  const tomato = new Tomato();
  tomato.parent = tomatoes;

  const xMin = range.x + tomato.width / 2;
  const xMax = range.x + range.width - tomato.width / 2;
  tomato.x = randInt(xMin, xMax);
  tomato.y = -tomato.height / 2;

  const targetX = randInt(xMin, xMax);
  const targetY = app.screen.height + tomato.height / 2;

  const moveAnim = tomato.startAnimation()
    .to({ x: targetX, y: targetY }, Math.abs(targetY - tomato.y) / speeds[randInt(0, speeds.length)])
    .onUpdate(() => {
      if (state !== GameState.Play) { return; }

      if (hit(spoon.hitRange, tomato.hitRange) || hit(fork.hitRange, tomato.hitRange)) {
        moveAnim.stop();

        tomato.remove();

        score++;
        scoreLabel.score = score;
      }
    })
    .onComplete(() => {
      tomato.parent = null;

      if (state === GameState.Play) {
        gameOver();
      }
    })
    .start();

  tomatoAnims.push(moveAnim);
}

function gameOver() {
  state = GameState.GameOver;

  gameOverLabel.show();
}

function start() {
  scoreLabel.show();
  state = GameState.Play;
}

function retry() {
  tomatoes.removeChildren();
  tomatoAnims.forEach(v => v.stop());

  state = GameState.Play;
  score = 0;
  counter = 0;
  prevSpawn = [];
  pressedKeys = [];
  scoreLabel.score = score;

  gameOverLabel.hide();
}

function update(time: number) {
  if (state === GameState.GameOver) {
    spawnTomato(randInt(0, 1) === 0 ? leftRect : rightRect);
    return;
  }

  spoon.move(pressedKeys, leftRect);

  if (state === GameState.Guide) {
    if (!leftGuideEnd && hit(spoon.hitRange, guideLabel.hitRangeLeft)) {
      guideLabel.hideLeft();
      leftGuideEnd = true;
    }

    if (!rightGuideEnd && hit(fork.hitRange, guideLabel.hitRangeRight)) {
      guideLabel.hideRight();
      rightGuideEnd = true;
    }

    if (leftGuideEnd && rightGuideEnd) {
      start();
    }

    return;
  }

  if (counter >= intervals[gameLevel()]) {
    counter = 0;

    let spawnPos = 0;

    if (prevSpawn.length < sameMax) {
      spawnPos = randInt(0, 1);

      if (prevSpawn.length > 0 && prevSpawn.indexOf(spawnPos) === -1) {
        prevSpawn = [];
      }
    } else {
      spawnPos = prevSpawn[0] === 0 ? 1 : 0;
      prevSpawn = [];
    }

    spawnTomato(spawnPos === 0 ? leftRect : rightRect);

    prevSpawn.push(spawnPos);
  } else {
    counter += time;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(app.view);
  app.ticker.add(() => TWEEN.update());
  app.ticker.add(update);

  app.stage.hitArea = new Rectangle(0, 0, app.screen.width, app.screen.height);
  app.stage.interactive = true;

  app.stage.on('pointermove', event => {
    if (state === GameState.GameOver) { return; }

    fork.move(event.data.getLocalPosition(event.currentTarget), rightRect);
  });

  const inputKeys = ['w', 'a', 's', 'd'];
  const agent = window.navigator.userAgent.toLowerCase();
  const isEdge = agent.indexOf('edge') !== -1;

  window.addEventListener('keydown', event => {
    if (state === GameState.GameOver) { return; }

    if (inputKeys.indexOf(event.key) !== -1) {
      pressedKeys.push(event.key);
    }
  });

  window.addEventListener('keyup', event => {
    if (state === GameState.GameOver) { return; }

    // Edgeのみkeyupのkeyがkeydownと正しく対応していない場合があるためkeyCodeを使用
    if (isEdge) {
      switch (event.keyCode) {
        case 87:
          pressedKeys = pressedKeys.filter(v => v !== 'w');
          break;
        case 65:
          pressedKeys = pressedKeys.filter(v => v !== 'a');
          break;
        case 83:
          pressedKeys = pressedKeys.filter(v => v !== 's');
          break;
        case 68:
          pressedKeys = pressedKeys.filter(v => v !== 'd');
          break;
      }
    } else {
      pressedKeys = pressedKeys.filter(v => v !== event.key);
    }
  });
});

