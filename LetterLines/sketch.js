/// <reference path="../TSDef/p5.global-mode.d.ts" />
"use strict";
p5.disableFriendlyErrors = true; // disables FES

// P_3_2_4_01
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Drawing tool for creating moire effect compositions using
 * smooth path of any length, width, smoothness and colour.
 *
 * MOUSE
 * position x          : path simplification
 * position y          : ribbon width
 *
 * KEYS
 * arrow right         : increase path density
 * arrow left          : decrease path density
 * arrow up            : increase font size
 * arrow down          : decrease font size
 * control             : save png
 *
 * CONTRIBUTED BY
 * [Niels Poldervaart](http://NielsPoldervaart.nl)
 */
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


let recording;

var capturer;
var recorder;
var chunks = [];

function preload() {

  capturer = new CCapture({
    format: "png",
    name:"frames",
    // framerate: 60,
    verbose: true,
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
  noLoop();

}

let noiseX = 0;
function draw() {
  background(backCol);

  translate(width * 0.1, height * 0.6);

  pathSampleFactor = 0.1 * pow(0.02, xoff / width);
  ribbonWidth = map(mouseY, 0, height, 1, 200);

  for (var i = 0; i < letters.length; i++) {
    shapeColor = chroma(map(i, 0, letters.length-1, 260, 360), 1, 0.6, "hsl").rgb();
    letters[i].update(0);
    letters[i].draw();
  }

  xoff -= 1;
  if (xoff <= 0) {
    xoff = 0;
  }
  noiseX += 0.001;
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
  for (var i = 0; i < chars.length; i++) {
    box = font.textBounds(chars[i], 0, 0, fontSize);
    var newLetter = new Letter(chars[i], totalW + box.x, 0);
    totalW += box.w + (i == 0 ? 0 : 50);
    letters.push(newLetter);
  }
}

function Letter(char, x, y) {
  this.char = char;
  this.x = x;
  this.y = y;
  this.noise = 0;

  Letter.prototype.update = function (noiseVal) {
    this.noise = noiseVal;
  };
  Letter.prototype.draw = function () {
    var path = font.textToPoints(this.char, this.x, this.y, fontSize, {
      sampleFactor: pathSampleFactor,
    });
    stroke(shapeColor);

    for (var d = 0; d < ribbonWidth; d += density) {
      beginShape();

      for (var i = 0; i < path.length; i++) {
        var pos = path[i];
        var nextPos = path[i + 1];

        if (nextPos) {
          var p0 = createVector(pos.x, pos.y);
          var p1 = createVector(nextPos.x, nextPos.y);
          var v = p5.Vector.sub(p1, p0);
          v.normalize();
          v.rotate(HALF_PI);
          v.mult(d);
          var pneu = p5.Vector.add(p0, v);
          curveVertex(pneu.x, pneu.y);
        }
      }

      endShape(CLOSE);
    }
  };
}

function keyReleased() {
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), "png");

  if (keyCode == LEFT_ARROW) density *= 1.25;
  if (keyCode == RIGHT_ARROW) density /= 1.25;

  if (keyCode == UP_ARROW) {
    fontSize *= 1.1;
    createLetters();
  }
  if (keyCode == DOWN_ARROW) {
    fontSize /= 1.1;
    createLetters();
  }

  if (keyCode == ENTER) createLetters();
}

function keyPressed() {
  if(key===' '){
    loop()
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

  if (keyCode == DELETE || keyCode == BACKSPACE) {
    if (textTyped.length > 0) {
      textTyped = textTyped.substring(0, textTyped.length - 1);
      createLetters();
    }
  }
}

function keyTyped() {
 
}
