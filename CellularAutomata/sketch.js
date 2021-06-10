/// <reference path="../TSDef/p5.global-mode.d.ts" />
"use strict";
p5.disableFriendlyErrors = true; // disables FES

// TODO: check this out later
// https://github.com/TrevorSundberg/h264-mp4-encoder/issues/5
// https://stackoverflow.com/questions/42437971/exporting-a-video-in-p5-js

let dialogs = [
  "Hobbits!",
  // "No. No it isn't.",
  // "Up! Quickly!",
  // "Silence!",
  // "Stay this madness!",
  // "Back to the gate! Hurry!",
  // "Bring them down!",
  // "Foreseen and done nothing!",
  // "Where? When?",
  // "Helm's Deep",
  // "You shall not pass!",
  // "Steady! Steady!",
  // "Volley!, Fire!  ",
  // "Fly, you fools! ",
  // "Hope is kindled!",
  // "I've sent him to his death.",
  // "Thank you.",
  // "Yes.",
];

const Vec = (x, y) => ({ x, y }); // Simple vector object

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

// text stuff
let font;
let path;
let polys = [];
let textRect = [];
let padding = 20;

// render stuff
let grid;
let cols;
let rows;
let resolution = 10;

// drawing
var backCol = 255;
var fr = 10;
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
    format: "webm",
    framerate: fr,
  });

  opentype.load("data/FreeSansNoPunch.otf", function (err, f) {
    if (err) {
      console.log(err);
    } else {
      font = f;
      // get a path from OpenType.js
      let totalW = 0;
      let totalH = 0;
      let rand = floor(random(dialogs.length - 1));
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
}


function setup() {
  createCanvas(windowWidth, windowHeight, P2D);
  cols = floor(width / resolution);
  rows = floor(height / resolution);
  console.log(cols, rows);
  grid = make2DArray(cols, rows);
  // for (let i = 0; i < cols; i++) {
  //   for (let j = 0; j < rows; j++) {
  //     grid[i][j] = floor(random(2));
  //     // for (let k = 0; k < polys.length; k++) {
  //     //   const poly = polys[k];
  //     //   if (inside([i, j], poly)) {
  //     //     grid[i][j] = 1;
  //     //     return;
  //     //   } else {
  //     //     grid[i][j] = 0;
  //     //   }
  //     // }
  //   }
  // }
  let fontCols = floor(textRect[2] / resolution);
  let fontRows = floor(textRect[3] / resolution);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
      // for (let k = 0; k < polys.length; k++) {
      //   const poly = polys[k];
      //   if (inside([i, j], poly)) {
      //     grid[i][j] = 1;
      //     return;
      //   } else {
      //     grid[i][j] = 0;
      //   }
      // }
    }
  }

  background(backCol);
  frameRate(fr);
}

function draw() {
  if (!font) return;

  background(backCol);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      if (grid[i][j] > 0) {
        fill(0);
        stroke(255);
        rect(x, y, resolution - 1, resolution - 1);
      }
    }
  }

  let next = make2DArray(cols, rows);

  // Compute next based on grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      // Count live neighbors!
      let sum = 0;
      let neighbors = countNeighbors(grid, i, j);

      if (state == 0 && neighbors == 3) {
        next[i][j] = 1;
      } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0;
      } else {
        next[i][j] = state;
      }
    }
  }

  grid = next;

  // fill(255, 255, 255, 0.1);
  // stroke(255);

  // background(55);
  for (let i = 0; i < polys.length; i++) {
    const poly = polys[i];
    beginShape();
    inside([mouseX, mouseY], poly) ? fill(0, 225, 0) : fill(0);
    for (const { x, y } of poly) {
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  // stroke(255);

  // circle(mouseX, mouseY, 10); // put a small ellipse on our point.

  // let hit = collidePointPoly(mouseX, mouseY, polys[0]);

  // fill(hit ? color("red") : 0);
  // noLoop();
  // loop();

  if (recording) {
    capturer.capture(canvas);
  }

  if (showFPS) {
    doShowFPS();
  }

  if (clearBackground) {
    background(backCol);
    clearBackground = false;
  }
}

function keyPressed() {
  // R - record (start-stop)
  if (keyCode === 82) {
    // if (!recording) {
    //   recorder.start();
    //   recording = true;
    //   return;
    // }
    // recorder.stop();
    // recording = false;
    if (!recording) {
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

  // spacebar - clear screen
  if (keyCode == 32) {
    clearBackground = !clearBackground;
  }

  // c - change render noise
  if (keyCode === 67) {
    drawMode = drawMode == 1 ? 2 : 1;
  }
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

function inside(point, vs) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

  var x = point[0];
  var y = point[1];
  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i].x,
      yi = vs[i].y;
    var xj = vs[j].x,
      yj = vs[j].y;

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

function doShowFPS() {
  let fps = frameRate();
  fill(55);
  rect(0, height - 24, 50, 20);
  fill(255);
  stroke(0);
  text(fps.toFixed(0), 10, height - 10);
}

function record() {
  chunks.length = 0;
  let stream = document.querySelector("canvas").captureStream(60);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };
  recorder.onstop = exportVideo;
}

function exportVideo(e) {
  var blob = new Blob(chunks);
  var vid = document.createElement("video");
  vid.id = "recorded";
  vid.controls = true;
  vid.src = URL.createObjectURL(blob);
  document.body.appendChild(vid);
  vid.play();
}
