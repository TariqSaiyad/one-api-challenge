/// <reference path="../TSDef/p5.global-mode.d.ts" />
"use strict";
p5.disableFriendlyErrors = true; // disables FES

// TODO: find a way to export as video

// https://github.com/TrevorSundberg/h264-mp4-encoder/issues/5
// https://stackoverflow.com/questions/42437971/exporting-a-video-in-p5-js

const Vec = (x, y) => ({ x, y }); // Simple vector object

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
  "You shall not pass!",
  // // "Steady! Steady!",
  // "Volley!, Fire!  ",
  // "Fly, you fools! ",
  // "Hope is kindled!",
  // "I've sent him to his death.",
  // // "Thank you.",
  // "Yes.",
];

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
  // deal with strings here
  dialogs = dialogs.map((d) => d.trim());
  dialogs = dialogs.map((d) => d.toUpperCase());
  dialogs = dialogs.map((d) => '"' + d.toUpperCase() + '"');

  // create capture object for exporting frames
  capturer = new CCapture({
    format: "png",
    name: "frames",
    // framerate: 60,
  });
}

// text stuff
var time = 0;
var font;
var path;
var polys = [];
var textRect = [];
var padding = 20;

// render stuff
var agents = [];
var agentCount = 1500;
var noiseScale = 1000;
var noiseStrength = 10;
var noiseZRange = 0.4;
var noiseZVelocity = 0.01;
var overlayAlpha = 0;
var strokeWidth = 1.5;
var drawMode = 1; // C to change
var backCol = 255;

// drawing
var clearBackground = false;
var showFPS = true;
var stopped = false;
var recording;
var capturer;

function setup() {
  createCanvas(windowWidth, windowHeight, P2D);
  background(backCol);
  noStroke(); // noFill();
  // frameRate(24);

  // load font data and extract font path vectors
  opentype.load("data/FreeSansNoPunch.otf", function (err, f) {
    if (err) {
      console.log(err);
    } else {
      font = f;
      // calculate total text width so far
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

      // get text dimensions.
      let charW = (width - totalW) / 2;
      let charH = (height - totalH) / 2;

      // get path for each character.
      for (let i = 0; i < selectedText.length; i++) {
        var fontPath = font.getPath(selectedText[i]);
        // convert it to a g.Path object
        path = new g.Path(fontPath.commands);
        // resample it with equidistant points
        path = g.resampleByLength(path, 1);
        let poly = [];
        // create array of points for this character.
        for (var j = 0; j < path.commands.length; j++) {
          var pnt = path.commands[j];
          poly[j] = createVector(pnt.x + charW, pnt.y + charH);
        }
        charW += path.bounds().width + 10;
        // push to array for each character
        polys.push(poly.filter((v) => v.x > 0 && v.y > 0));
      }

      // bounding box for text
      textRect = [
        charW - totalW - padding / 2,
        charH - totalH - padding / 2,
        totalW + padding,
        totalH + padding,
      ];

      // noLoop();
    }
  });

  // FLOW FIELD agents
  for (var i = 0; i < agentCount; i++) {
    agents[i] = new Agent(noiseZRange);
  }
}

function draw() {
  if (!font) return;
  fill(backCol, overlayAlpha);
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

  if (recording) {
    capturer.capture(canvas);
  }

  if (showFPS) {
    doShowFPS();
  }
}

function keyPressed() {
  // R - record (start-stop)
  if (keyCode === 82) {
    if (!recording) {
      capturer.start();
      recording = true;
      return;
    }
    recording = false;
    console.log("recording stopped");
    capturer.stop();
    capturer.save();
  }
  // S - stop/play
  if (keyCode === 83) {
    stopped ? loop() : noLoop();
    stopped = !stopped;
  }

  // spacebar - clear screen
  if (keyCode == 32) {
    background(backCol);
  }

  // c - change render noise
  if (keyCode === 67) {
    drawMode = drawMode == 1 ? 2 : 1;
  }
}

function doVis1() {
  // for each agent, 
  for (var i = 0; i < agentCount; i++) {
    let hit;
    // check if its within the bounding box of the text.
    let withinBounds = collidePointRect(
      agents[i].vector.x,
      agents[i].vector.y,
      textRect[0],
      textRect[1],
      textRect[2],
      textRect[3]
    );

    // if so, check if it hits any point of the text's character path. 
    if (withinBounds) {
      for (let j = 0; j < polys.length; j++) {
        const poly = polys[j];
        if (collidePointPoly(agents[i].vector.x, agents[i].vector.y, poly)) {
          hit = true;
          break;
        }
      }
    }

    // update the particle agent with noise parameters
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
