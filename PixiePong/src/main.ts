import * as PIXI from 'pixi.js';
import '../public/style.scss';

async function init() {
  const app = new PIXI.Application();

  await app.init({
    backgroundColor: '#000000',
    width: 800,
    height: 800
  });

  document.getElementById('game')?.appendChild(app.canvas);

  // create a circle, define circle attributes
  const circle = new PIXI.Graphics();
  const radius: number = 5;
  const BORDER_COLOR = 0x0798f2;
  const BORDER_HIT_COLOR = 0xe30bb5;

  // border helper function
  function createBorder(x: number, y: number, width: number, height: number) {
    const border = new PIXI.Graphics();
    border.fill(BORDER_COLOR).rect(x, y, width, height).fill();
    app.stage.addChild(border);
    return border;
  }

  // change border color on hit
  function markBorderHit(border: PIXI.Graphics, x: number, y: number, w: number, h: number) {
    border.clear();
    border.fill(BORDER_HIT_COLOR).rect(x, y, w, h).fill();
  }

  // borders
  const borders = {
    top: createBorder(0, 0, 800, 5),
    bottom: createBorder(0, 795, 800, 5),
    left: createBorder(0, 0, 5, 800),
    right: createBorder(795, 0, 5, 800),
  };

  // tracking hit borders
  const bordersHit = {
    top: false,
    bottom: false,
    left: false,
    right: false,
  };

  circle
    .fill(0x9926fc)
    .circle(0, 0, radius)
    .fill();

  // start it in the middle-ish
  circle.x = 450;
  circle.y = 400;

  app.stage.addChild(circle);

  let xv: number = 2;
  let yv: number = 2;

  // promise to conclude game when all borders are hit
  function waitForAllBordersHit(): Promise<void> {
    return new Promise(resolve => {
      const tick = () => {
        // right
        if (circle.x + radius >= 800) {
          circle.x = 800 - radius;
          xv = -xv;
          if (!bordersHit.right) {
            bordersHit.right = true;
            markBorderHit(borders.right, 795, 0, 5, 800);
          }
        }

        // left
        if (circle.x - radius <= 0) {
          circle.x = radius;
          xv = -xv;
          if (!bordersHit.left) {
            bordersHit.left = true;
            markBorderHit(borders.left, 0, 0, 5, 800);
          }
        }

        // bottom
        if (circle.y + radius >= 800) {
          circle.y = 800 - radius;
          yv = -yv;
          if (!bordersHit.bottom) {
            bordersHit.bottom = true;
            markBorderHit(borders.bottom, 0, 795, 800, 5);
          }
        }

        // top
        if (circle.y - radius <= 0) {
          circle.y = radius;
          yv = -yv;
          if (!bordersHit.top) {
            bordersHit.top = true;
            markBorderHit(borders.top, 0, 0, 800, 5);
          }
        }

        circle.x += xv;
        circle.y += yv;

        if (Object.values(bordersHit).every(Boolean)) {
          // last color change actually happens before alert
          app.ticker.remove(tick);
          requestAnimationFrame(() => resolve());
        }
      }

      app.ticker.add(tick);

    });
  }

  await waitForAllBordersHit();
  alert('All borders hit! Game complete!');
}

init();
