/// <reference path="../TSDef/p5.global-mode.d.ts" />
"use strict";
p5.disableFriendlyErrors = true; // disables FES

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
    name: "frames",
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
  strokeWeight(0.75);
}

function draw() {
  // get x,y coords from perlin noise
  var x = noise(xoff) * width;
  var y = noise(yoff) * height;
  lineModuleSize = y / 2;

  // start drawing line.
  push();
  // move to x,y position and rotate by some angle
  translate(x, y);
  rotate(radians(angle));
  // get color from x,y position
  c = chroma(map(x * y, 0, width * height, 0, 360), 1, 0.6, "hsl").rgb();
  stroke(c);
  // draw line here
  line(0, 0, lineModuleSize, lineModuleSize);
  pop();

  // update variables
  angle += angleSpeed;
  xoff += 0.005;
  yoff += 0.007;

  // draw "invisible" text at the end of every frame
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
  // Space - stop/play
  if (key === " ") {
    stopped ? loop() : noLoop();
    stopped = !stopped;
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
