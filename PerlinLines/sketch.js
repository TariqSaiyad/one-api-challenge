/// <reference path="../TSDef/p5.global-mode.d.ts" />
"use strict";
p5.disableFriendlyErrors = true; // disables FES

/**
 * draw tool. draw with a rotating element (svg file).
 *
 * MOUSE
 * drag                : draw
 *
 * KEYS
 * 1-4                 : switch default colors
 * 5-9                 : switch brush element
 * delete/backspace    : clear screen
 * d                   : reverse direction and mirrow angle
 * space               : new random color
 * arrow left          : rotaion speed -
 * arrow right         : rotaion speed +
 * arrow up            : module size +
 * arrow down          : module size -
 * shift               : limit drawing direction
 * s                   : save png
 */
("use strict");

let dialogs = [
  // 'Hobbits!',
  // "No. No it isn't.",
  // "Up! Quickly!",
  // "Silence!",
  // "Stay this madness!",
  // "Back to the gate! Hurry!",
  // "Bring them down!",
  // // "Foreseen and done nothing!",
  // "Where? When?",
  // "Helm's Deep",
  // "You shall not pass!",
  // // "Steady! Steady!",
  // "Volley!, Fire!  ",
  "Fly, you fools! ",
  // "Hope is kindled!",
  // "I've sent him to his death.",
  // // "Thank you.",
  // "Yes.",
];

var c;
var lineModuleSize = 0;
var angle = 0;
var angleSpeed = 1;
var lineModule = [];
var lineModuleIndex = 0;
let xoff = 0;
let yoff = 0;

// text stuff
let time = 0;
let font;
let path;
let polys = [];
let textRect = [];
let padding = 20;

// drawing
var backCol = 30;
var fr = 30;
var clearBackground = false;
var showFPS = true;
var stopped = false;

let recording;

var capturer;
var recorder;
var chunks = [];

function preload() {
  dialogs = dialogs.map((d) => d.trim());
  dialogs = dialogs.map((d) => d.toUpperCase());
  dialogs = dialogs.map((d) => '"' + d.toUpperCase() + '"');
  capturer = new CCapture({
    format: "png",
    name:'frames',
    // framerate: fr,
    verbose: true,
  });

  lineModule[1] = loadImage("data/02.svg");
  lineModule[2] = loadImage("data/03.svg");
  lineModule[3] = loadImage("data/04.svg");
  lineModule[4] = loadImage("data/05.svg");
}

function setup() {
  opentype.load("data/FreeSansNoPunch.otf", function (err, f) {
    if (err) {
      console.log(err);
    } else {
      font = f;
      // get a path from OpenType.js
      let totalW = 0;
      let totalH = 0;
      let rand = random(dialogs.length - 1).toFixed();
      let selectedText = dialogs[rand];
      for (let i = 0; i < selectedText.length; i++) {
        var fontPath = font.getPath(selectedText[i]);
        path = new g.Path(fontPath.commands);
        totalW += path.bounds().width + 10;
        if (path.bounds().height > totalH) {
          totalH = path.bounds().height;
        }
      }

      let charW = (width - totalW) / 2;
      let charH = (height - totalH) / 2;

      for (let i = 0; i < selectedText.length; i++) {
        var fontPath = font.getPath(selectedText[i]);
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
    }
  });

  createCanvas(windowWidth, windowHeight);
  background(backCol);
  // frameRate(fr);
  cursor(CROSS);
  strokeWeight(0.75);
  noLoop();
}

function draw() {
  // remember click position
  var x = noise(xoff) * width;
  var y = noise(yoff) * height;
  lineModuleSize = y / 2;
  push();
  translate(x, y);
  rotate(radians(angle));
  c = chroma(map(x * y, 0, width * height, 0, 360), 1, 0.6, "hsl").rgb();
  if (lineModuleIndex != 0) {
    tint(c);
    image(lineModule[lineModuleIndex], 0, 0, lineModuleSize, lineModuleSize);
  } else {
    stroke(c);
    line(0, 0, lineModuleSize, lineModuleSize);
  }
  angle += angleSpeed;
  pop();

  xoff += 0.005;
  yoff += 0.007;

  // draw "invisible" text
  fill(backCol);
  noStroke();
  for (let i = 0; i < polys.length; i++) {
    const poly = polys[i];
    beginShape();
    for (const { x, y } of poly) vertex(x, y);
    endShape(CLOSE);
  }

  if (recording) {
    capturer.capture(canvas);
  }

  if (showFPS) {
    doShowFPS();
  }
}

function mousePressed() {
  // create a new random color and line length
  lineModuleSize = random(50, 160);
}

function keyPressed() {
  if (keyCode === 82) {
    if (!recording) {
      loop();
      capturer.start();
      recording = true;
      return;
    }
    recording = false;
    console.log("recording stopped");
    capturer.stop();
    // default save, will download automatically a file called {name}.extension (webm/gif/tar)
    capturer.save();
  }
  // S - stop/play
  if (keyCode === 83) {
    stopped ? loop() : noLoop();
    stopped = !stopped;
  }

  if (keyCode == UP_ARROW) lineModuleSize += 5;
  if (keyCode == DOWN_ARROW) lineModuleSize -= 5;
  if (keyCode == LEFT_ARROW) angleSpeed -= 0.5;
  if (keyCode == RIGHT_ARROW) angleSpeed += 0.5;
}

function keyReleased() {
  if (key == "s" || key == "S") saveCanvas(gd.timestamp(), "png");
  if (keyCode == DELETE || keyCode == BACKSPACE) background(255);

  // reverse direction and mirror angle
  if (key == "d" || key == "D") {
    angle += 180;
    angleSpeed *= -1;
  }

  // load svg for line module
  if (key == "5") lineModuleIndex = 0;
  if (key == "6") lineModuleIndex = 1;
  if (key == "7") lineModuleIndex = 2;
  if (key == "8") lineModuleIndex = 3;
  if (key == "9") lineModuleIndex = 4;
}

function doShowFPS() {
  let fps = frameRate();
  fill(55);
  rect(0, height - 24, 50, 20);
  fill(255);
  stroke(0);
  text(fps.toFixed(0), 10, height - 10);
}
