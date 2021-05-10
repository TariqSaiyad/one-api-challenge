/// <reference path="../TSDef/p5.global-mode.d.ts" />
"use strict";
p5.disableFriendlyErrors = true; // disables FES
// P_4_3_2_01
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
 * pixel mapping. each pixel is translated into a new element (letter)
 *
 * KEYS
 * 1                 : toogle font size mode (dynamic/static)
 * 2                 : toogle font color mode (color/b&w)
 * arrow up/down     : maximal fontsize +/-
 * arrow right/left  : minimal fontsize +/-
 * s                 : save png
 */
'use strict';

// var inputText = 'All the world\'s a stage, And all the men and women merely players; They have their exits and their entrances; And one man in his time plays many parts, His acts being seven ages. At first the infant, Mewling and puking in the nurse\'s arms; Then the whining school-boy, with his satchel And shining morning face, creeping like snail Unwillingly to school. And then the lover, Sighing like furnace, with a woeful ballad Made to his mistress\' eyebrow. Then a soldier, Full of strange oaths, and bearded like the pard, Jealous in honour, sudden and quick in quarrel, Seeking the bubble reputation Even in the cannon\'s mouth. And then the justice, In fair round belly with good capon lin\'d, With eyes severe and beard of formal cut, Full of wise saws and modern instances; And so he plays his part. The sixth age shifts Into the lean and slipper\'d pantaloon, With spectacles on nose and pouch on side, His youthful hose, well sav\'d, a world too wide For his shrunk shank; and his big manly voice, Turning again toward childish treble, pipes And whistles in his sound. Last scene of all, That ends this strange eventful history, Is second childishness and mere oblivion; Sans teeth, sans eyes, sans taste, sans every thing.';
var inputText = 'Now come the days of the King. May they be blessed.Hobbits!Be careful. Even in defeat, Saruman is dangerous.  No, we need him alive. We need him to talk.  Your treachery has already cost many lives. Thousands more are now at risk. But you could save them Saruman. You were deep in the enemy\'s counsel. Farewell my brave Hobbits. , My work is now finished. ,Here at last, on the shores of the sea, comes the end of our Fellowship. , I will not say do not weep for not all tears are an evil. , It is time Frodo.  Saruman\'.. your staff is broken! End? No, the journey doesn\'t end here. Death is just another path, one that we all must take. , The grey rain curtain of this world rolls back and all turns to silvered glass. And then you see it.  No! Come down Saruman and your life will be spared!No. No it isn\'t. White shores and beyond, a far green country under a swift sunrise.  Saruman! You were deep in the enemy\'s counsel. Tell us what you know!Send word to all our allies and to every corner of Middle Earth that still stands free. The enemy moves against us. We need to know where he will strike.Peregrin Took. I\'ll take that my lad! Quickly now!Retreat! The city is breached. Fall back to the second level. Get the women and children out. Get them out. Retreat.Fight! Fight to the last man. Fight for your lives.Up! Quickly! , Go back to the abyss! Fall into the nothingness that awaits you and your master!   We do not come to treat with Sauron, faithless and accursed. Tell your master this. The armies of Mordor must disband. He is to depart these lands, never to return.   Silence!Silence!Stay this madness! So passes Denethor, son of Ecthelion.  Back to the gate! Hurry!Prepare for battle. Hurry men! To the wall! Defend the wall! Over here! Return to your posts.Send these foul beasts into the Abyss.Hold them back, do not give in to fear. Stand to your posts. Fight!  Not at the towers! Aim for the trolls, kill the trolls! Bring them down!Fight them back! ,Peregrin Took! Go back to the Citadel. This is no place for a Hobbit!Guard of the Citadel indeed! , Now back up the hill quickly. Quick!  Foreseen and done nothing!Faramir?  This is not the first Halfling to have crossed your path.Where?  When?Sauron\'s wrath will be terrible, his retribution swift.   The battle for Helm\'s Deep is over. The battle for Middle-earth is about to begin.(looking back out to Mordor) All our hopes now lie with two little Hobbits...  Faramir!  Faramir!  , Your father\'s will has turned to madness.  Do not throw away your life so rashly.   Your father loves you Faramir.  ,  He will remember it before the end.   And then the pass of Cirith Ungol.Faramir tell me everything.  Tell me all you know....somewhere in the wilderness.Courage is the best defence that you have now.Look to my coming at first light on the fifth day. At dawn......Iook to the east. Theoden King stands alone.,    Theodred\'s death was not of your making.He was strong in life. His spirit will find its way to the halls of your fathers. Westu h\'l. Fer\'u, Th\'odred, Fer\'u. The veiling shadow that glowers in the east takes shape.Sauron will suffer no rival.From the summit of Barad-durhis Eye watches ceaselessly.But he is not so mighty yetthat he is above fear.Doubt ever gnaws at him.The rumor has reached him.The heir of Numenor still lives.This is but a taste of the terror that Saruman will unleash. ,All the more potent for he is driven now by fear of Sauron. Ride out and meet him head on. Draw him away from your women and children. , You must fight. Helm\'s Deep.There is no way out of that ravine. Theoden is walking into a trap. He thinks he\'s leading them to safety. What they will get is a massacre. Theoden has a strong will, but I fear for him. I fear for the survival of Rohan. , He will need you before the end, Aragorn. The people of Rohan will need you. ,The defenses , to hold.  Sauron fears you, Aragorn.He fears what you may become.And so he\'ll strike hard and fastat the world of Men.He will use his puppet Sarumanto destroy Rohan.War is coming.Rohan must defend itselfand therein lies our first challenge......for Rohan is weak and ready to fall. ,The king\'s mind is enslavedit\'s an old device of Saruman\'s.His hold over King Theodenis now very strong.Sauron and Sarumanare tightening the noose.But for all their cunning......we have one advantage. The Ring remains hidden.And that we should seek to destroy it......has not yet enteredtheir darkest dreams. And so the weapon of the enemyis moving towards Mordor......in the hands of a Hobbit.Each day brings it closerto the fires of Mount Doom. We must trust now in Frodo.Everything depends upon speed......and the secrecy of his quest. Did he?Did he, indeed? Good. Yes, very good.Do not regret your decision to leave him.Frodo must finish this task alone.The Grey Pilgrim. That\'s what they used to call me. Three hundred lives of Men I\'ve walked this earth, and now I have no time. With luck, my search will not be in vain. ,Look to my coming at first light on the fifth day. At dawn, look to the east. You shall not pass!I am a servant of the Secret Fire, wielder of the flame of Anor. Go back to the Shadow.The dark fire will not avail you,flame of Udun!You cannot pass!You are soldiers of Gondor. No matter what comes through that gate you will stand your ground.Steady! Steady! Volley! , Fire!  Peregrin Took my lad, there is a task now to be done.  Another opportunity for one of the Shire folk to prove their great worth.  , You must not fail me.   Fly, you fools! Amon D\'n.Hope is kindled! Frodo has passed beyond my sight. , The darkness is deepening.     It\'s only a matter of time. He has suffered a defeat, yes, but behind the walls of Mordor our enemy is regrouping.   Because 10,000 Orcs now stand between Frodo and Mount Doom.  Edoras and the Golden Hall of Meduseld. There dwells Theoden, King of Rohan...... whose mind is overthrown. Saruman\'s hold over King Theoden is now very strong. Be careful what you say.Do not look for welcome here.Sauron will suspect a trap. He will not take the bait.I\'ve sent him to his death.You\'re in the service of the steward now.  You\'ll have to do as you are told Peregrin Took.Ridiculous Hobbit!  Guard of the Citadel!Thank you.Yes.It\'s the deep breath before the plunge.There never was much hope.  Just a fool\'s hope.  , Our enemy is ready.  His full strength\'s gathered.   Not only orcs, but men as well ,  Legions of Haradrim from the South, mercenaries from the coast , All will answer Mordor\'s call.  Frodo, come and help an old man ,How\'s your shoulder? The Fellowship awaits the Ringbearer.Left.We must hold this course west of the Misty Mountains for forty days. If our luck holds the Gap of Rohan will still be open to us. , and there are road turns east to Mordor. No Gimli, I would not take the road through Moria unless I had no other choice. Hmmm ,You would not part an old man from his walking stick.The courtesy of your hall is somewhat lessened of late......Theoden King.Be silent. Keep your forked tongue behind your teeth. I have not passed through fire and death......to bandy crooked words with a witless worm.Sauron has yet to show his deadliest servant.  ,  The one who will lead Mordor\'s army in war.  , The one they say no living man can kill. , The Witch King of Angmar. You\'ve met him before.  ,  He stabbed Frodo on Weathertop. , He is the lord of the Nazg\'l.  The greatest of the nine. This will be the end of Gondor as we know it.    Here the hammer stroke will fall hardest.  ,  If the river is taken, if the garrison at Osgiliath falls, the last defence of this city will be gone.  and the Ring ? , You feel its power growing don\'t you. I\'ve felt it too.  You must be careful now.  Evil will be drawn to you from outside the Fellowship and I fear from within.  You must trust to yourself. Trust your own strength.There are many powers in this world for good or for evil.  Some are greater than I am and against some I have not yet been testedIt reads \"The Doors of Durin, Lord of Moria, Speak Friend and Enter\" Oh it\'s quite simple.  If you are a friend, you speak the password and the doors will open , Annon Edhellen, edro hi ammen! (  Fennas Nogothrim, lasto beth lammen. Yes Gimli! Their own masters cannot find them, if their secrets are forgotten! Spies of Saruman.  The passage south is being watched ,  We must take the Pass of Caradhras  Ash nazg durbatul\'k, ash nazg gimbatul ash nazg thrakatul\'k ,agh burzum-ishi krimpatul. I do not ask your pardon Master Elrond for the Black Speech of Mordor may yet be heard in every corner of the West , The Ring is altogether evil  Aragorn is right.  We cannot use it';

var fontSizeMax = 10;
var fontSizeMin = 5;
var spacing = 5; // line height
var kerning = 0; // between letters

var fontSizeStatic = false;
var blackAndWhite = false;

var img;
function preload() {
  // let url =
  //   "https://the-one-api.dev/v2/character/5cd99d4bde30eff6ebccfea0/quote?limit=100";
  // httpDo(
  //   url,
  //   {
  //     method: "GET",
  //     // headers: { authorization: "Bearer lmGW6BTscDApdnQ6eDEt" },
  //     headers: { authorization: "Bearer lQ0H9o2kpWInNqjiBgfi" },
  //   },
  //   function (res) {
  //     let data = JSON.parse(res);
  //     data.docs.map((d) => allDialog+=d.dialog);
  //     console.log(allDialog);
  //   }
  // );
  img = loadImage('data/img_1_50.png');
}

function setup() {
  let ratio = img.width / img.height;
  createCanvas(windowHeight * ratio, windowHeight);
  textFont('Times');
  textSize(10);
  textAlign(LEFT, CENTER);
  print(img.width + ' • ' + img.height);
  img.loadPixels();

}
var x = 0;
var y = 10;
var counter = 0;
var speed = 50;
function draw() {
  //  background(255);


  //  while (y < height) {
  // translate position (display) to position (image)
  for (let index = 0; index < speed; index++) {
    // get current color
    var imgX = round(map(x, 0, width, 0, img.width));
    var imgY = round(map(y, 0, height, 0, img.height));
    var c = color(img.get(imgX, imgY));
    var greyscale = round(red(c) * 0.222 + green(c) * 0.707 + blue(c) * 0.071);

    push();
    translate(x, y);

    if (fontSizeStatic) {
      textSize(fontSizeMax);
      if (blackAndWhite) {
        fill(greyscale);
      } else {
        fill(c);
      }
    } else {
      // greyscale to fontsize
      var fontSize = map(greyscale, 0, 255, fontSizeMax, fontSizeMin);
      fontSize = max(fontSize, 1);
      textSize(fontSize);
      if (blackAndWhite) {
        fill(0);
      } else {
        fill(c);
      }
    }

    var letter = inputText.charAt(counter);
    text(letter, 0, 0);
    var letterWidth = textWidth(letter) + kerning;
    // for the next letter ... x + letter width
    x += letterWidth;

    pop();

    // linebreaks
    if (x + letterWidth >= width) {
      x = 0;
      y += spacing;
    }

    counter++;
    if (counter >= inputText.length) {
      counter = 0;
    }

    if (y >= height) {
      noLoop();
    }
    

  }
  speed += 10;
  //  }
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  // change render mode
  if (key == '1') fontSizeStatic = !fontSizeStatic;
  // change color style
  if (key == '2') blackAndWhite = !blackAndWhite;
  print('fontSizeMin: ' + fontSizeMin + ', fontSizeMax: ' + fontSizeMax + ', fontSizeStatic: ' + fontSizeStatic + ', blackAndWhite: ' + blackAndWhite);
  //  loop();121
}

function keyPressed() {
  // change fontSizeMax with arrow keys up/down
  if (keyCode == UP_ARROW) fontSizeMax += 2;
  if (keyCode == DOWN_ARROW) fontSizeMax -= 2;
  // change fontSizeMin with arrow keys left/right
  if (keyCode == RIGHT_ARROW) fontSizeMin += 2;
  if (keyCode == LEFT_ARROW) fontSizeMin -= 2;
  //  loop();
}
