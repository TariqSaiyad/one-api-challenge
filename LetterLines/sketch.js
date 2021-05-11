/// <reference path="../TSDef/p5.global-mode.d.ts" />
"use strict";
p5.disableFriendlyErrors = true; // disables FES
("use strict");

var letters = [];
var density = 2;
var ribbonWidth = 92;
var maxRibbonWidth = 90;
var shapeColor;
var fontSize = 200;
var pathSimplification = 0;
var pathSampleFactor = 0.1;

var textTyped = "SILENCE!";
var backCol = 55;
var font;
var xoff;
var yoff;

var recording;
var capturer;

function preload() {
  capturer = new CCapture({
    format: "png",
    name: "frames",
    // framerate: 60,
  });

  font = loadFont("data/FreeSansNoPunch.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(1);
  shapeColor = color(0);
  xoff = width;
  yoff = 0;
  createLetters();
}

function draw() {
  background(backCol);
  translate(width * 0.1, height * 0.6);

  pathSampleFactor = 0.1 * pow(0.02, xoff / width);
  // maps to mouse Y value.
  ribbonWidth = map(mouseY, 0, height, 1, 200);

  for (var i = 0; i < letters.length; i++) {
    // each character a different colour
    let col = map(i, 0, letters.length - 1, 260, 360);
    shapeColor = chroma(col, 1, 0.6, "hsl").rgb();
    letters[i].draw();
  }

  // update noise values
  xoff -= 1;
  if (xoff <= 0) {
    xoff = 0;
  }
  yoff += 0.001;

  if (recording) {
    capturer.capture(canvas);
  }
}

function createLetters() {
  letters = [];
  var chars = textTyped.split("");

  var box;
  let totalW = 0;
  // get bounds of each character, create Letter object with x,y pos
  for (var i = 0; i < chars.length; i++) {
    box = font.textBounds(chars[i], 0, 0, fontSize);
    var newLetter = new Letter(chars[i], totalW + box.x, 0);
    totalW += box.w + (i == 0 ? 0 : 50);
    letters.push(newLetter);
  }
}

// Letter object
function Letter(char, x, y) {
  this.char = char;
  this.x = x;
  this.y = y;

  Letter.prototype.draw = function () {
    // get path points for this character
    let path = font.textToPoints(this.char, this.x, this.y, fontSize, {
      sampleFactor: pathSampleFactor,
    });
    // change colour
    stroke(shapeColor);

    // for the number of ribbons, draw the vertices in this shape along the path.
    for (let d = 0; d < ribbonWidth; d += density) {
      beginShape();
      for (let i = 0; i < path.length; i++) {
        let pos = path[i];
        let nextPos = path[i + 1];

        if (nextPos) {
          // get start and end points
          let start = createVector(pos.x, pos.y);
          let end = createVector(nextPos.x, nextPos.y);
          // get the difference vector
          let v = p5.Vector.sub(end, start);
          // convert to unit vector of length 1
          v.normalize();
          v.rotate(HALF_PI);
          // now we multiply to get ribbons
          v.mult(d);
          // add this vector to the starting point and draw curve
          let finalV = p5.Vector.add(start, v);
          curveVertex(finalV.x, finalV.y);
        }
      }
      endShape(CLOSE);
    }
  };
}

function keyPressed() {
  if (key === " ") {
    loop();
  }

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
}
