var agentAlpha = 90;
var Agent = function (noiseZRange) {
  // start with random x,y pos.
  this.vector = Vec(random(width), random(height));
  // store the old pos in order to draw a line.
  this.vectorOld = Vec(this.vector.x, this.vector.y);
  // movement steps
  this.stepSize = random(1, 5);
  this.angle;
  this.noiseZ = random(noiseZRange);
};

Agent.prototype.update = function (strokeW, noiseZVelocity, hit, mode) {
  //calculate polar coords for next position
  this.vector.x += cos(this.angle) * this.stepSize;
  this.vector.y += sin(this.angle) * this.stepSize;

  // check if it goes out of screen. Bring it back from the other side
  if (this.vector.x < -10) this.vector.x = this.vectorOld.x = width + 10;
  if (this.vector.x > width + 10) this.vector.x = this.vectorOld.x = -10;
  if (this.vector.y < -10) this.vector.y = this.vectorOld.y = height + 10;
  if (this.vector.y > height + 10) this.vector.y = this.vectorOld.y = -10;

  let x = this.vector.x,
    y = this.vector.y;

  // color stuff. Map color range to x*y function.
  let col = map(x * y, 0, height * width, mode ? 0 : 360, mode ? 90 : 240);
  !hit ? stroke(chroma(col, 1, 0.6, "hsl").rgb(), agentAlpha) : stroke(0);

  // map strokewidth to distance to center
  let dist2Center = dist(x, y, width / 2, height / 2);
  let maxDist = dist(0, 0, width / 2, height / 2);
  let strW = map(dist2Center, 0, maxDist, strokeW, noiseZVelocity * strokeW);

  // draw the line from last pos to current pos.
  strokeWeight(strW);
  line(this.vectorOld.x, this.vectorOld.y, this.vector.x, this.vector.y);

  // set current pos to old pos.
  this.vectorOld = Vec(this.vector.x, this.vector.y);

  // update noise;
  this.noiseZ += noiseZVelocity;
};

Agent.prototype.update1 = function (
  strokeWidth,
  noiseScale,
  noiseStrength,
  noiseZVelocity,
  hit
) {
  // update angle based on perlin noise function.
  this.angle =
    noise(this.vector.x / noiseScale, this.vector.y / noiseScale, this.noiseZ) *
    noiseStrength;

  this.update(strokeWidth, noiseZVelocity, hit, true);
};

Agent.prototype.update2 = function (
  strokeWidth,
  noiseScale,
  noiseStrength,
  noiseZVelocity,
  hit
) {
  this.angle =
    noise(this.vector.x / noiseScale, this.vector.y / noiseScale, this.noiseZ) *
    24;
  this.angle = (this.angle - floor(this.angle)) * noiseStrength;

  this.update(strokeWidth, noiseZVelocity, hit, false);
};
