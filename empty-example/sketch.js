/// <reference path="../TSDef/p5.global-mode.d.ts" />

"use strict";
p5.disableFriendlyErrors = true; // disables FES

// TODO: remove later??
// let dialogs = [];
let dialogs = [
  '"Hobbits!"',
  "No.  No it isn't.",
  "Up! Quickly!",
  "Silence!",
  "Stay this madness!",
  "Back to the gate! Hurry!",
  "Bring them down!",
  "Foreseen and done nothing!",
  "Where?  When?",
  "Helm's Dee",
  "You shall not pass!",
  "You cannot pass!",
  "Steady! Steady!",
  "    Volley! , Fire!  ",
  "Fly, you fools! ",
  "Amon D'n.",
  "Hope is kindled!",
  "I've sent him to his death.",
  "Thank you.",
  "Yes.",
  "Left.",
];

const Vec = (x, y) => ({x,y}); // Simple vector object


// function preload() {
//   let url =
//     "https://the-one-api.dev/v2/character/5cd99d4bde30eff6ebccfea0/quote?limit=100";
//   httpDo(
//     url,
//     {
//       method: "GET",
//       headers: { authorization: "Bearer lmGW6BTscDApdnQ6eDEt" },
//     },
//     function (res) {
//       let data = JSON.parse(res);
//       let dSet = new Set();
//       data.docs.map((d) => dSet.add(d.dialog));
//       let dialogs = [...dSet];
//       // find specifics here
//       dialogs = dialogs.filter((d) => d.length < 30);
//       console.log(dialogs);
//     }
//   );
// }

function preload() {
  dialogs = dialogs.map((d) => d.trim());
  dialogs = dialogs.map((d) => d.toUpperCase());
}

// text stuff
let time = 0;
let font;
let path;
let polys = [];
let textRect = [];
let padding = 20;

// render stuff
var agents = [];
var agentCount = 1000;
var noiseScale = 100;
var noiseStrength = 10;
var noiseZRange = 0.4;
var noiseZVelocity = 0.01;
var overlayAlpha = 0.5;
var strokeWidth = 2;
var drawMode = 1; // C to change

// drawing
var clearBackground = false;
var showFPS = true;
var pdf;
function setup() {
  createCanvas(windowWidth, windowHeight, P2D);
  background(255);
  noStroke(); // noFill();
  frameRate(60);
  opentype.load("data/FreeSansNoPunch.otf", function (err, f) {
    if (err) {
      console.log(err);
    } else {
      font = f;
      // get a path from OpenType.js
      let totalW = 0;
      let totalH = 0;
      for (let i = 0; i < dialogs[0].length; i++) {
        var fontPath = font.getPath(dialogs[0][i]);
        path = new g.Path(fontPath.commands);
        totalW += path.bounds().width + 10;
        if (path.bounds().height > totalH) {
          totalH = path.bounds().height;
        }
      }

      let charW = (width - totalW) / 2;
      let charH = (height - totalH) / 2;

      for (let i = 0; i < dialogs[0].length; i++) {
        var fontPath = font.getPath(dialogs[0][i]);
        // convert it to a g.Path object
        path = new g.Path(fontPath.commands);
        // resample it with equidistant points
        path = g.resampleByLength(path, 1);

        let poly = [];
        for (var j = 0; j < path.commands.length; j++) {
          var pnt = path.commands[j];
          poly[j] = createVector(pnt.x + charW, pnt.y + charH);
        }
        charW += path.bounds().width + 10;
        polys.push(poly.filter((v) => v.x > 0 && v.y > 0));
      }

      textRect = [
        charW - totalW - padding / 2,
        charH - totalH - padding / 2,
        totalW + padding,
        totalH + padding,
      ];

      loop();
    }
  });

  // FLOW FIELD
  for (var i = 0; i < agentCount; i++) {
    agents[i] = new Agent(noiseZRange);
  }
}

function draw() {
  // translate(width / 2, height / 2);
  if (!font) return;
  // translate(20, 220);
  // FLOW FIELD
  fill(255, overlayAlpha);
  noStroke();
  rect(0, 0, width, height);

  // Draw agents

  doVis1();

  // fill(255, 255, 255, 0.1);
  // stroke(255);

  // background(55);
  // for (let i = 0; i < polys.length; i++) {
  //   const poly = polys[i];
  //   beginShape();
  //   for (const { x, y } of poly) vertex(x, y);
  //   endShape(CLOSE);
  // }
  // circle(mouseX, mouseY, 10); // put a small ellipse on our point.

  // let hit = collidePointPoly(mouseX, mouseY, polys[0]);

  // fill(hit ? color("red") : 0);
  // noLoop();
  // loop();
  // if (frameCount >= 600) {
  //   save(frameCount + ".svg");
  //   noLoop();
  // }

  if (showFPS) {
    doShowFPS();
  }

  if (clearBackground) {
    background(255);
    clearBackground = false;
  }
}

function keyPressed() {
  if (keyCode == 32) {
    clearBackground = true;
  }
  // console.log(keyCode);
  if (keyCode === 67) {
    drawMode = drawMode == 1 ? 2 : 1;
  }
}

function doVis1() {
  for (var i = 0; i < agentCount; i++) {
    let hit;
    let doCheck = collidePointRect(
      agents[i].vector.x,
      agents[i].vector.y,
      textRect[0],
      textRect[1],
      textRect[2],
      textRect[3]
    );

    if (doCheck) {
      for (let j = 0; j < polys.length; j++) {
        const poly = polys[j];
        if (collidePointPoly(agents[i].vector.x, agents[i].vector.y, poly)) {
          hit = true;
        }
      }
    }

    // if(hit){background(0)}
    if (drawMode == 1) {
      agents[i].update1(
        strokeWidth,
        noiseScale,
        noiseStrength,
        noiseZVelocity,
        hit
      );
    } else {
      agents[i].update2(
        strokeWidth,
        noiseScale,
        noiseStrength,
        noiseZVelocity,
        hit
      );
    }
  }
}

function doShowFPS() {
  let fps = frameRate();
  fill(55);
  rect(0, height - 24, 50, 20);
  fill(255);
  stroke(0);
  text(fps.toFixed(0), 10, height - 10);
}
