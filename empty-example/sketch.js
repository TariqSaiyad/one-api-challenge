/// <reference path="../TSDef/p5.global-mode.d.ts" />

"use strict";

// TODO: remove later??
// let dialogs = [];
let dialogs = [
  "Hobbits!",
  "No.  No it isn't.",
  "Up! Quickly!",
  "Silence!",
  "Stay this madness!",
  "Back to the gate! Hurry!",
  "Bring them down!",
  "Foreseen and done nothing!",
  "Where?  When?",
  "Helm's Deep.",
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

function setup() {
  angleMode(DEGREES);
  createCanvas(650, 650, P2D);
  background(55);
  noStroke();
  // noFill();
  console.table(textSize());
}

function draw() {
  // translate(width / 2, height / 2);
  fill(27,71,150)
  for (let i = 0; i < dialogs.length; i++) {
    const dialog = dialogs[i];
    text(dialog, 50, 50 + ( textSize()*i*2));
    return
  }
}
